import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Disable GregTech Pollution',
  description:
    'Many machines cause pollution. But pollution currently only causes annoying effects rather than real reasons to act against it. This tweak turns off pollution mechanics entirely.',
  icon: { kind: 'emoji', value: '🤢' },
  supportedVersions: [gtnhVersionIds.v2_8_0],
  followsStargateRules: true,
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/GregTech/Pollution.cfg',
      `Index: .minecraft/config/GregTech/Pollution.cfg
===================================================================
--- .minecraft/config/GregTech/Pollution.cfg
+++ .minecraft/config/GregTech/Pollution.cfg
@@ -1,9 +1,9 @@
 # Configuration file
 
 pollution {
     # if true, enables pollution in the game. [default: true]
-    B:"Activate Pollution"=true
+    B:"Activate Pollution"=false
 
     # Pollution Amount for Advanced Coke Ovens [range: -2147483648 ~ 2147483647, default: 80]
     I:advancedCokeOvenPollutionAmount=80
 
`,
    );
  },
});
