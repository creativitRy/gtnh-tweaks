import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Remove Underground Dirt and Gravel Pockets',
  description:
    'Default GTNH has patches of dirt and gravel underground to annoy you during mining. This patch disables those from getting generated.',
  icon: { kind: 'emoji', value: '⛏️' },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/GregTech/WorldGeneration.cfg',
      `Index: .minecraft/config/GregTech/WorldGeneration.cfg
===================================================================
--- .minecraft/config/GregTech/WorldGeneration.cfg
+++ .minecraft/config/GregTech/WorldGeneration.cfg
@@ -18,12 +18,12 @@
         # if true, enables red granite ore gen. [default: true]
         B:generateRedGraniteOres=true
 
         # if true, enables underground dirt gen. Does nothing if the vanilla oregen is enabled! [default: true]
-        B:generateUndergroundDirtGen=true
+        B:generateUndergroundDirtGen=false
 
         # if true, enables underground gravel gen. Does nothing if the vanilla oregen is enabled! [default: true]
-        B:generateUndergroundGravelGen=true
+        B:generateUndergroundGravelGen=false
     }
 
     endasteroids {
         # The maximum size for the end asteroids. [range: -2147483648 ~ 2147483647, default: 200]
`,
    );
  },
});
