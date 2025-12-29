import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Borderless Windowed Fullscreen',
  description: 'Replaces the fullscreen mode with a borderless windowed mode.',
  icon: { kind: 'emoji', value: '🖥️' },
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
      '.minecraft/config/lwjgl3ify.cfg',
      `Index: .minecraft/config/lwjgl3ify.cfg
===================================================================
--- .minecraft/config/lwjgl3ify.cfg
+++ .minecraft/config/lwjgl3ify.cfg
@@ -76,9 +76,9 @@
 
 
 window {
     # Should exclusive fullscreen mode replaced with borderless fullscreen mode [default: false]
-    B:borderless=false
+    B:borderless=true
 
     # Windows-only - should borderless window have height increased by 1 to solve flickering on un-focusing [default: true]
     B:borderlessWindowsCompatibility=true
 
`,
    );
  },
});
