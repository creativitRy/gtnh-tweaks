import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Server MOTD',
  description: 'Enables message of the day. This will be displayed when player joins the server.',
  icon: { kind: 'emoji', value: '💬' },
  supportedVersions: [gtnhVersionIds.v2_8_0],
  followsStargateRules: true,
  configs: {
    msg: {
      type: 'textbox',
      label: 'Message',
      default: '§6§lChange me§r',
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -226,16 +226,16 @@
 
 
 login {
     # Enables message of the day. [default: false]
-    B:enable_motd=false
+    B:enable_motd=true
 
     # Enables starting items. [default: false]
     B:enable_starting_items=false
 
     # Message of the day. This will be displayed when player joins the server. [default: [Hello player!]]
     S:motd <
-        "Hello player!"
+        "${config.msg}"
      >
 
     # Items to give player when they first join the server.
     # Format: '{id:"ID",Count:X,Damage:X,tag:{}}', Use /print_item to get NBT of item in your hand. [default: [{id:"minecraft:stone_sword",Count:1,Damage:1,tag:{display:{Name:"Epic Stone Sword"}}}]]
`,
    );
  },
});
