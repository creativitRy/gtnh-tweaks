import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Disable Item Dislocator Sound',
  description: "Disable sound made by Draconic Evolution's Item Dislocator (magnet)",
  icon: {
    kind: 'image',
    src: 'https://github.com/Draconic-Inc/Draconic-Evolution/blob/1.21/src/main/resources/assets/draconicevolution/textures/item/magnet.png?raw=true',
    alt: 'Item Dislocator',
  },
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
      '.minecraft/config/DraconicEvolution.cfg',
      `Index: .minecraft/config/DraconicEvolution.cfg
===================================================================
--- .minecraft/config/DraconicEvolution.cfg
+++ .minecraft/config/DraconicEvolution.cfg
@@ -93,9 +93,9 @@
         appliedenergistics2:item.ItemCrystalSeed
      >
 
     # Disable item dislocator sound
-    B:"Item Dislocator Disable Sound"=false
+    B:"Item Dislocator Disable Sound"=true
 
     # Add the id's of dimensions you do not want draconium ore to spawn in
     I:"Ore gen dimension blacklist" <
         7
`,
    );
  },
});
