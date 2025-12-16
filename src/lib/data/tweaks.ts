import type { GroupId, TweakDef } from '$lib/tweak';

const tweaks: {
	[group in GroupId]: Omit<TweakDef, 'group'>[];
} = {
	Graphics: [],
	QoL: [
		{
			id: 'larger_tsearch_radius',
			name: 'Larger T Search Radius',
			description:
				'Increases the T search radius so that you can find items in chests/machines farther away. Default value is 16.',
			icon: { kind: 'emoji', value: '🔍' },
			configs: {
				radius: {
					type: 'select',
					label: 'Search Radius',
					default: '24',
					options: ['24', '32', '64']
				}
			},
			supportedVersions: () => true,
			stargateState: (config) => parseInt(config.radius as string) <= 32,
			onDownload: async (config, downloadCtx) => {
				await downloadCtx.patchFile(
					'.minecraft/config/findit.cfg',
					`Index: .minecraft/config/findit.cfg
===================================================================
--- .minecraft/config/findit.cfg
+++ .minecraft/config/findit.cfg
@@ -32,9 +32,9 @@
     # Search items dropped on ground
     S:SearchItemsOnGround=true
 
     # Radius to search within
-    S:SearchRadius=16
+    S:SearchRadius=${config.radius}
 
     # Use Particle for Block Highlighter
     S:UseParticleHighlighter=false
 }
`
				);
			}
		},
		{
			id: 'detailed_item_tooltips',
			name: 'Detailed Item Tooltips',
			description:
				'Adds detailed tooltips to itmes on hover, such as burn time, registry name, etc.',
			icon: { kind: 'emoji', value: '💡' },
			supportedVersions: () => true,
			stargateState: true,
			onDownload: async (config, downloadCtx) => {
				await downloadCtx.patchFile(
					'.minecraft/config/neiintegration.cfg',
					`Index: .minecraft/config/neiintegration.cfg
===================================================================
--- .minecraft/config/neiintegration.cfg
+++ .minecraft/config/neiintegration.cfg
@@ -22,27 +22,27 @@
 
 
 tooltips {
     # Show the burn time of items when used as furnace fuel.
-    B:"Burn Time"=false
+    B:"Burn Time"=true
 
     # If burn times are enabled, they will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
     B:"Burn Time Advanced"=false
 
     # If burn times are enabled, they will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Burn Time Shift"=false
 
     # Show some fluid info on fluid-related items.
-    B:"Fluid Registry Info"=false
+    B:"Fluid Registry Info"=true
 
     # If fluid registry info is enabled, it will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
-    B:"Fluid Registry Info Advanced"=false
+    B:"Fluid Registry Info Advanced"=true
 
     # If fluid registry info is enabled, it will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Fluid Registry Info Shift"=false
 
     # Show the internal name (example: 'minecraft:stone') of items.
-    B:"Internal Name"=false
+    B:"Internal Name"=true
 
     # If internal names are enabled, they will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
     B:"Internal Name Advanced"=false
 
@@ -58,12 +58,12 @@
     # If maximum stack sizes are enabled, they will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Maximum Stack Size Shift"=false
 
     # Show the Ore Dictionary names of items.
-    B:"Ore Dictionary Names"=false
+    B:"Ore Dictionary Names"=true
 
     # If Ore Dictionary names are enabled, they will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
-    B:"Ore Dictionary Names Advanced"=false
+    B:"Ore Dictionary Names Advanced"=true
 
     # If Ore Dictionary names are enabled, they will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Ore Dictionary Names Shift"=false
 
`
				);
			}
		}
	],
	Fun: []
};

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

// export const ALL_TWEAKS = new Map(TWEAKS.map((t) => [t.id, t]));
export const ALL_TWEAKS = new Map(
	Object.entries(tweaks).flatMap(([group, tweaks]) =>
		tweaks.map((t) => [t.id, { ...t, group } as TweakDef])
	)
);
