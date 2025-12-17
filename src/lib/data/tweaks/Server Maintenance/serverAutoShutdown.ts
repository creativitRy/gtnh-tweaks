import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Server Auto Shutdown',
  description: 'Server will automatically shut down once per day at 1PM. Why 1PM? IDK lol.',
  icon: { kind: 'emoji', value: '🔌' },
  supportedVersions: () => true,
  followsStargateRules: true,
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
+        13:00
      >
 }
 
 
`,
    );
  },
});
