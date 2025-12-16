export type TweakId = string;
export type VersionId = string;
export type GroupId = 'Graphics' | 'QoL' | 'Fun' | 'Mechanics';

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
};

export type SelectConfig = {
	type: 'select';
	label: string;
	default: string;
	options: string[];
};

export type ConfigSchema = CheckboxConfig | SliderConfig | SelectConfig;

export type TweakIcon =
	| { kind: 'emoji'; value: string }
	| { kind: 'image'; src: string; alt?: string };

export interface TweakDef {
	id: TweakId;
	name: string;
	description: string;
	icon: TweakIcon;
	group: GroupId;
	configs?: Record<string, ConfigSchema>;
	incompatibleWith?: TweakId[];

	supportedVersions: (v: VersionId) => boolean;
	stargateState: ((config: Record<string, ConfigValue>) => boolean) | boolean;
}

export type TweakConfig = Record<string, ConfigValue>;
export type SelectedTweaksMap = Record<TweakId, TweakConfig>;
