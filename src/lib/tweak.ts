import JSZip from 'jszip';
import { applyPatch, type StructuredPatch } from 'diff';
import type { Writable } from 'svelte/store';
import { ServerRanks } from '$lib/serverRanks';

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

  supportedVersions: (v: VersionId) => boolean;
  followsStargateRules: ((config: Record<string, ConfigValue>) => boolean) | boolean;

  filesToDelete?: (modpackVersion: string, config: Record<string, ConfigValue>) => string[];
  modsToDownload?: (
    modpackVersion: string,
    config: Record<string, ConfigValue>,
  ) => { name: string; url: string; filename: string }[];
  onDownload: (config: Record<string, ConfigValue>, ctx: DownloadContext) => Promise<void>;
}

export type TweakConfig = Record<string, ConfigValue>;
export type SelectedTweaksMap = Record<TweakId, TweakConfig>;

export function defineTweak(
  tweak: Omit<TweakDef, 'group' | 'id'>,
): Omit<TweakDef, 'group' | 'id'> & { defineTweak: true } {
  return { ...tweak, defineTweak: true };
}

export class DownloadContext {
  private zip: JSZip;
  private createdFiles = new Set<string>();
  private modifiedFiles = new Map<string, string>();
  private deletedFiles = new Set<string>();

  constructor(
    readonly version: string,
    private readonly selections: SelectedTweaksMap,
    readonly ALL_TWEAKS: Map<string, TweakDef>,
  ) {
    this.zip = new JSZip();
  }

  createRawFile(filePath: string, content: string | Blob): void {
    if (this.createdFiles.has(filePath)) throw new Error(`File ${filePath} was already created`);
    this.createdFiles.add(filePath);
    this.zip.file(filePath, content);
  }

  async patchFile(filePath: string, patch: string | StructuredPatch | [StructuredPatch]): Promise<void> {
    let prev = this.modifiedFiles.get(filePath);
    if (prev === undefined) {
      console.assert(filePath.startsWith('.minecraft/'));
      const url = `gtnh/${this.version}/${filePath.slice('.minecraft/'.length)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      prev = await response.text();
    }
    const patchResult = applyPatch(prev, patch, {fuzzFactor: 16, autoConvertLineEndings: true});
    if (patchResult === false) {
      throw new Error(`Failed to apply patch to ${filePath}.\nPatch:\n${patch}\n\nFile:\n${prev}`);
    }
    this.modifiedFiles.set(filePath, patchResult);
  }

  /**
   *
   * @param rankName if undefined, change all ranks
   * @param key
   * @param value value to set. If undefined, remove the key(s).
   */
  patchServerRanks(rankName: string | undefined, key: string, value: string | undefined): void {
    const filePath = '.minecraft/serverutilities/server/ranks.txt';
    let prevRaw = this.modifiedFiles.get(filePath);
    if (prevRaw === undefined) {
      prevRaw = `// For more info visit https://github.com/GTNewHorizons/ServerUtilities

[player]
default_player_rank: true
power: 1
serverutilities.claims.max_chunks: 100
serverutilities.chunkloader.max_chunks: 50
serverutilities.homes.max: 1
serverutilities.homes.warmup: 5s
serverutilities.homes.cooldown: 5s
serverutilities.homes.cross_dim: false

[vip]
power: 20
serverutilities.chat.name_format: <&bVIP {name}&r>
serverutilities.claims.max_chunks: 500
serverutilities.chunkloader.max_chunks: 100
serverutilities.homes.max: 1
serverutilities.homes.warmup: 0s
serverutilities.homes.cooldown: 1s
serverutilities.homes.cross_dim: false

[admin]
default_op_rank: true
power: 100
serverutilities.chat.name_format: <&2{name}&r>
serverutilities.claims.max_chunks: 1000
serverutilities.chunkloader.max_chunks: 1000
serverutilities.claims.bypass_limits: true
serverutilities.homes.max: 1
serverutilities.homes.warmup: 0s
serverutilities.homes.cooldown: 0s
serverutilities.homes.cross_dim: false`;
    }
    const ranks = new ServerRanks(prevRaw);
    ranks.patch(rankName, key, value);
    this.modifiedFiles.set(filePath, ranks.generate());
  }

  async generate(zipProgress: Writable<number | undefined>, part1Progress: number): Promise<Blob> {
    const FINAL_ZIP_PROGRESS = 0.9;
    const part2ProgressDelta = (FINAL_ZIP_PROGRESS - part1Progress) * 0.9;
    let i = 0;
    for (const [id, content] of this.modifiedFiles.entries()) {
      this.zip.file(id, content);
      i++;
      zipProgress.set(Math.min(FINAL_ZIP_PROGRESS, part1Progress + (i * part2ProgressDelta) / this.modifiedFiles.size));
    }

    for (const [id, tweakConfig] of Object.entries(this.selections)) {
      const tweak = this.ALL_TWEAKS.get(id)!;
      for (const mod of tweak.modsToDownload ? tweak.modsToDownload(this.version, tweakConfig) : []) {
        this.createdFiles.add(`.minecraft/mods/${mod.filename}`);
      }
      for (const file of tweak.filesToDelete ? tweak.filesToDelete(this.version, tweakConfig) : []) {
        this.deletedFiles.add(file);
      }
    }

    this.zip.file(
      '.minecraft/gtnh-tweaks.txt',
      `${window.location.href}

This file was generated by GTNH Tweaks.

- Modpack Version:
  - ${this.version}
- Selected Tweaks:
${Object.keys(this.selections)
  .map(id => `  - ${id}`)
  .sort()
  .join('\n')}
- Created Files:${[...this.createdFiles.values().map(f => `  - ${f}\n`)]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .join('')}
- Modified files:${[...this.modifiedFiles.values().map(f => `  - ${f}\n`)]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .join('')}
- Deleted Files:${[...this.deletedFiles.values().map(f => `  - ${f}\n`)]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .join('')}
`,
    );
    zipProgress.set(FINAL_ZIP_PROGRESS);
    return this.zip.generateAsync({ type: 'blob' });
  }
}
