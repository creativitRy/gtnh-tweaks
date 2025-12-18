import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Disable Thaumcraft Warp (Wuss Mode)',
  description:
    'Progressing through Thaumcraft might give you permanent annoying effects. This tweak disables warp and similar mechanics. You wuss.',
  icon: { kind: 'emoji', value: '👶' },
  supportedVersions: [gtnhVersionIds.v2_8_0, gtnhVersionIds.v2_8_1, gtnhVersionIds.v2_8_2, gtnhVersionIds.v2_8_3],
  followsStargateRules: false,
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/Thaumcraft.cfg',
      `Index: .minecraft/config/Thaumcraft.cfg
===================================================================
--- .minecraft/config/Thaumcraft.cfg
+++ .minecraft/config/Thaumcraft.cfg
@@ -113,9 +113,9 @@
     # Set to true to have the wand dial display in the bottom left instead of the top left.
     B:wand_dial_bottom=true
 
     # Setting this to true disables Warp and similar mechanics. You wuss.
-    B:wuss_mode=false
+    B:wuss_mode=true
 }
 
 
 ##########################################################################################################
`,
    );
  },
});
