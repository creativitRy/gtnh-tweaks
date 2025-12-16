import type { TweakDef } from '$lib/tweak';

export const TWEAKS: TweakDef[] = [
	{
		id: 'fast_render',
		name: 'Fast Render',
		description: 'Optimizes rendering pipeline. Incompatible with Shader Core.',
		icon: '⚡',
		group: 'Graphics',
		incompatibleWith: ['shader_core'],
		configs: {
			level: { type: 'slider', label: 'Optimization Level', min: 1, max: 5, default: 3 }
		},
		supportedVersions: () => true,
		stargateState: true
	},
	{
		id: 'shader_core',
		name: 'Shader Core',
		description: 'Enables advanced shaders. Heavy on performance.',
		icon: '🌈',
		group: 'Graphics',
		supportedVersions: (v) => v === '2.7.0', // Only new versions
		stargateState: true
	},
	{
		id: 'ez_recipes',
		name: 'Easy Recipes',
		description: 'Simplifies recipes for casual play.',
		icon: '🍰',
		group: 'QoL',
		configs: {
			mode: {
				type: 'select',
				label: 'Difficulty',
				options: ['Easy', 'Super Easy'],
				default: 'Easy'
			}
		},
		supportedVersions: () => true,
		stargateState: false
	},
	{
		id: 'flight_tweak',
		name: 'Creative Flight',
		description: 'Allows flight in survival based on config.',
		icon: '🕊️',
		group: 'Fun',
		configs: {
			allowInDungeons: { type: 'checkbox', label: 'Allow in Dungeons', default: false }
		},
		supportedVersions: () => true,
		// Dynamic Stargate Rule
		stargateState: (cfg) => !cfg.allowInDungeons
	}
];
