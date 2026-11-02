import type { DownloadContext } from './downloadContext';

export type TweakId = string;
export type VersionId = string;

export type ConfigValue = string | number | boolean;

export type CheckboxConfig = {
  type: 'checkbox';
  label: string;
  default: boolean;
};

export type SliderConfig = {
  type: 'slider';
  label: string;
  default: number;
  min: number;
  max: number;
  step: number;
};

export type TextBoxConfig = {
  type: 'textbox';
  label: string;
  default: string;
};

export type NumberBoxConfig = {
  type: 'number';
  label: string;
  default: number;
  min: number;
  max: number;
  step: number;
};

export type SelectConfig = {
  type: 'select';
  label: string;
  default: string;
  options: string[];
};

export type ConfigSchema = CheckboxConfig | SliderConfig | TextBoxConfig | NumberBoxConfig | SelectConfig;

export type TweakIcon = { kind: 'emoji'; value: string } | { kind: 'image'; src: string; alt?: string };

export interface TweakDef {
  group: string;
  id: TweakId;
  name: string;
  description: string;
  icon: TweakIcon;
  configs?: Record<string, ConfigSchema>;
  incompatibleWith?: TweakId[];

  supportedVersions: 'all' | VersionId[] | Set<VersionId>;
  followsStargateRules: ((config: Record<string, ConfigValue>) => boolean) | boolean;

  filesToDelete?: (modpackVersion: string, config: Record<string, ConfigValue>) => string[];
  filesToDownload?: (modpackVersion: string, config: Record<string, ConfigValue>) => ModToDownload[];
  onDownload: (config: Record<string, ConfigValue>, ctx: DownloadContext) => Promise<void>;
}
export type ModToDownload = { description: string; url: string; filename: string };

export type TweakConfig = Record<string, ConfigValue>;
export type SelectedTweaksMap = Record<TweakId, TweakConfig>;

export function supportsVersion(tweak: TweakDef, version: VersionId): boolean {
  if (tweak.supportedVersions === 'all') return true;
  if (tweak.supportedVersions instanceof Set) return tweak.supportedVersions.has(version);
  if (Array.isArray(tweak.supportedVersions)) return tweak.supportedVersions.includes(version);
  throw new Error(`Invalid ${tweak.id} supportedVersions: ${tweak.supportedVersions}`);
}

export function defineTweak(
  tweak: Omit<TweakDef, 'group' | 'id'>,
): Omit<TweakDef, 'group' | 'id'> & { defineTweak: true } {
  let supportedVersions = tweak.supportedVersions;
  if (Array.isArray(supportedVersions) && supportedVersions.length > 2) {
    supportedVersions = new Set(supportedVersions);
  }
  return { ...tweak, defineTweak: true, supportedVersions };
}
