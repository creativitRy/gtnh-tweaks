import { defineTweak, gtnhVersionIds } from '@gtnh-tweaks/core';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Disable Blood Moon Red Light',
  description: 'Disables the annoying red tinted light during blood moons.',
  icon: { kind: 'emoji', value: '🌘' },
  supportedVersions: [gtnhVersionIds.v2_9_0],
  followsStargateRules: true,
  onDownload: async (_config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/RandomThings.cfg',
      `Index: .minecraft/config/RandomThings.cfg
===================================================================
--- .minecraft/config/RandomThings.cfg
+++ .minecraft/config/RandomThings.cfg
@@ -78,9 +78,9 @@
     # Whether players are NOT allowed to sleep during a bloodmoon
     B:BloodMoonNoSleep=true
 
     # Whether light will be tinted red on a Bloodmoon
-    B:BloodMoonRedLight=true
+    B:BloodMoonRedLight=false
 
     # Whether the moon will be red on a Bloodmoon
     B:BloodMoonRedMoon=true
 
`,
    );
  },
});
