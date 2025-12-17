import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Server Auto Shutdown',
  description: 'Server will automatically shut down once per day. Fixes memory leaks and stuff.',
  icon: { kind: 'emoji', value: '🔌' },
  supportedVersions: [gtnhVersionIds.v2_8_0, gtnhVersionIds.v2_8_1, gtnhVersionIds.v2_8_2, gtnhVersionIds.v2_8_3],
  followsStargateRules: true,
  configs: {
    time: {
      type: 'textbox',
      label: 'Shutdown Time',
      default: '13:00',
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -13,19 +13,18 @@
 
 
 auto_shutdown {
     # Enables auto-shutdown. [default: false]
-    B:enabled=false
+    B:enabled=true
 
     # Enables auto-shutdown in singleplayer worlds. [default: false]
     B:enabled_singleplayer=false
 
     # Server will automatically shut down after X hours.
     # Time Format: HH:MM. If the system time matches a value, server will shut down.
     # It will look for closest value available that is not equal to current time. [default: [04:00], [16:00]]
     S:times <
-        04:00
-        16:00
+        ${config.time}
      >
 }
 
 
`,
    );
  },
});
