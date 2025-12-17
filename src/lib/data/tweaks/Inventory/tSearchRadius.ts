import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Larger T Search Radius',
  description:
    'Increases the T search radius so that you can find items in chests/machines farther away. Default value is 16.',
  icon: { kind: 'emoji', value: '🔍' },
  configs: {
    radius: {
      type: 'number',
      label: 'Search Radius',
      default: 24,
      min: 17,
      max: 128,
      step: 1,
    },
  },
  supportedVersions: [gtnhVersionIds.v2_8_0, gtnhVersionIds.v2_8_1, gtnhVersionIds.v2_8_2, gtnhVersionIds.v2_8_3],
  followsStargateRules: config => parseInt(config.radius as string) <= 32,
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
`,
    );
  },
});
