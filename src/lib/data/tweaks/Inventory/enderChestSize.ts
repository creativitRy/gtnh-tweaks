import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Ender Chest Inventory Size',
  description: 'You can change how many slots an ender chest has.',
  icon: {
    kind: 'image',
    src: 'https://cdn.modrinth.com/data/gxSiDoVF/fcdbbd566fd2b7feb746813b355b03cbadad4869_96.webp',
    alt: 'Ender Chest Inventory Size',
  },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  configs: {
    slots: {
      type: 'select',
      label: 'Number of Slots',
      default: '3x9',
      options: ['3x3', '3x9', '6x9'],
    },
  },
  onDownload: async (config, downloadCtx) => {
    let slots = -1;
    if (config.slots === '3x3') slots = 0;
    if (config.slots === '3x9') slots = 1;
    if (config.slots === '6x9') slots = 2;
    if (slots < 0) return;
    await downloadCtx.patchFile(
      '.minecraft/config/EnderStorage.cfg',
      `Index: .minecraft/config/EnderStorage.cfg
===================================================================
--- .minecraft/config/EnderStorage.cfg
+++ .minecraft/config/EnderStorage.cfg
@@ -22,9 +22,9 @@
 #Set the size of ender tanks in buckets (x1000)
 enderTankSize=256
 
 #The size of each inventory of EnderStorage. 0 = 3x3, 1 = 3x9, 2 = 6x9
-item.storage-size=1
+item.storage-size=${slots}
 
 
 #The name of the item used to set the chest to personal. Diamond by default
 personalItemID=diamond`,
    );
  },
});
