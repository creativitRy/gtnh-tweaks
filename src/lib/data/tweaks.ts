import { defineTweak, type TweakDef, type TweakId } from '$lib/tweak';

function getDefinedTweaks(): Map<TweakId, TweakDef> {
	const allTweaks: Map<TweakId, TweakDef> = new Map();
	const idGroupRegex = /tweaks\/([^/]+)\/([^/]+)\.ts$/;
	const modules = import.meta.glob('./tweaks/*/*.ts', { eager: true });
	for (const [path, mod] of Object.entries(modules)) {
		const tweak = mod.default as ReturnType<typeof defineTweak>;
		console.assert(tweak.defineTweak);
		// extract group and id from path
		const [, group, id] = idGroupRegex.exec(path)!;
		if (allTweaks.has(id)) throw new Error(`Duplicate tweak ID: ${id}`);
		allTweaks.set(id, { ...tweak, id: id, group: group });
	}
	return allTweaks;
}

const TWEAKS: TweakDef[] = [
	{
		id: 'fast_render',
		name: 'Fast Render',
		description: 'Optimizes rendering pipeline. Incompatible with Shader Core.',
		icon: { kind: 'emoji', value: '⚡' },
		group: 'Graphics',
		incompatibleWith: ['shader_core'],
		configs: {
			level: { type: 'slider', label: 'Optimization Level', min: 1, max: 5, default: 3 }
		},
		supportedVersions: () => true,
		stargateState: true,
		onDownload: async (config, downloadCtx) => {}
	},
	{
		id: 'shader_core',
		name: 'Shader Core',
		description: 'Enables advanced shaders. Heavy on performance.',
		icon: { kind: 'emoji', value: '🌈' },
		group: 'Graphics',
		supportedVersions: (v) => v === '2.7.0', // Only new versions
		stargateState: true,
		onDownload: async (config, downloadCtx) => {}
	},
	{
		id: 'ez_recipes',
		name: 'Easy Recipes',
		description: 'Simplifies recipes for casual play.',
		icon: { kind: 'emoji', value: '🍰' },
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
		stargateState: false,
		onDownload: async (config, downloadCtx) => {}
	},
	{
		id: 'flight_tweak',
		name: 'Creative Flight',
		description: 'Allows flight in survival based on config.',
		icon: { kind: 'emoji', value: '🕊️' },
		group: 'Fun',
		configs: {
			allowInDungeons: { type: 'checkbox', label: 'Allow in Dungeons', default: false }
		},
		supportedVersions: () => true,
		// Dynamic Stargate Rule
		stargateState: (cfg) => !cfg.allowInDungeons,
		onDownload: async (config, downloadCtx) => {}
	}
];

export const ALL_TWEAKS = getDefinedTweaks();
// export const ALL_TWEAKS = new Map(TWEAKS.map((t) => [t.id, t]));
