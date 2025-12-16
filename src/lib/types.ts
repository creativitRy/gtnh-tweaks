export type TweakId = string;
export type VersionId = string;
export type GroupId = 'Graphics' | 'QoL' | 'Fun' | 'Mechanics';

// Configuration Schema as a discriminated union
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

export interface TweakDef {
	id: TweakId;
	name: string;
	description: string;
	icon: string; // emoji or svg path for now
	group: GroupId;
	configs?: Record<string, ConfigSchema>;
	incompatibleWith?: TweakId[];

	// Logic functions
	supportedVersions: (v: VersionId) => boolean;
	stargateState: ((config: Record<string, ConfigValue>) => boolean) | boolean;
}

// State Types
export type TweakConfig = Record<string, ConfigValue>;
export type SelectedTweaksMap = Record<TweakId, TweakConfig>;
