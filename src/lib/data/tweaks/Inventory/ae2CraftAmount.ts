import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';
import ae2CraftAmount from '$lib/assets/ae2CraftAmount.png';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'AE2 Crafting Amount',
  description:
    'When crafting items via AE2, you can specify how many items to craft. This tweak changes how large each increment button should be in the UI',
  icon: { kind: 'image', src: ae2CraftAmount, alt: 'AE2 Crafting Amount' },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  configs: {
    b1: {
      type: 'number',
      label: 'Button 1',
      default: 1,
      min: 1,
      max: 9,
      step: 1,
    },
    b2: {
      type: 'number',
      label: 'Button 2',
      default: 10,
      min: 10,
      max: 99,
      step: 1,
    },
    b3: {
      type: 'number',
      label: 'Button 3',
      default: 100,
      min: 100,
      max: 999,
      step: 1,
    },
    b4: {
      type: 'number',
      label: 'Button 4',
      default: 1000,
      min: 1000,
      max: 9999,
      step: 1,
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/AppliedEnergistics2/AppliedEnergistics2.cfg',
      `Index: .minecraft/config/AppliedEnergistics2/AppliedEnergistics2.cfg
===================================================================
--- .minecraft/config/AppliedEnergistics2/AppliedEnergistics2.cfg
+++ .minecraft/config/AppliedEnergistics2/AppliedEnergistics2.cfg
@@ -84,18 +84,18 @@
     I:levelAmtButton4=1000
     B:preserveSearchBar=true
 
     # Controls buttons on Priority Screen : Capped at 9
-    I:priorityAmtButton1=1
+    I:priorityAmtButton1=${config.b1}
 
     # Controls buttons on Priority Screen : Capped at 99
-    I:priorityAmtButton2=10
+    I:priorityAmtButton2=${config.b2}
 
     # Controls buttons on Priority Screen : Capped at 999
-    I:priorityAmtButton3=100
+    I:priorityAmtButton3=${config.b3}
 
     # Controls buttons on Priority Screen : Capped at 9999
-    I:priorityAmtButton4=1000
+    I:priorityAmtButton4=${config.b4}
     B:showOnlyInterfacesWithFreeSlotsInInterfaceTerminal=false
     B:useColoredCraftingStatus=true
     B:useTerminalUseLargeFont=false
 }
`,
    );
  },
});
