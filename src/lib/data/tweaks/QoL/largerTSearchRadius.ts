import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
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
});
