import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Disable Forestry Butterflies',
  description: 'Disable Forestry butterflies during tree breeding. They are highly annoying and cause a lot of lag.',
  icon: { kind: 'emoji', value: '🦋' },
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
      '.minecraft/config/forestry/common.cfg',
      `Index: .minecraft/config/forestry/common.cfg
===================================================================
--- .minecraft/config/forestry/common.cfg
+++ .minecraft/config/forestry/common.cfg
@@ -59,9 +59,9 @@
 
 
 mobs {
     #  [default: false]
-    B:disable.butterfly=false
+    B:disable.butterfly=true
 }
 
 
 optimization {
`,
    );
  },
});
