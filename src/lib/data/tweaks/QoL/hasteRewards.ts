import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Haste Potion Early Quest Rewards',
  description:
    'This adds haste potions to early game quest rewards. Players cannot recharge the potion until later, but this will help remove the tedium of mining.',
  icon: { kind: 'emoji', value: '🏃🏽‍♂️' },
  supportedVersions: [gtnhVersionIds.v2_8_1, gtnhVersionIds.v2_8_2, gtnhVersionIds.v2_8_3],
  followsStargateRules: false,
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/SOTIREDMUSTSLEEP-AAAAAAAAAAAAAAAAAAAADQ==.json',
      `Index: .minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/SOTIREDMUSTSLEEP-AAAAAAAAAAAAAAAAAAAADQ==.json
===================================================================
--- .minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/SOTIREDMUSTSLEEP-AAAAAAAAAAAAAAAAAAAADQ==.json
+++ .minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/SOTIREDMUSTSLEEP-AAAAAAAAAAAAAAAAAAAADQ==.json
@@ -60,8 +60,17 @@
           "Count:3": 1,
           "Damage:2": 1,
           "OreDict:8": "",
           "id:8": "enhancedlootbags:lootbag"
+        },
+        "3:10": {
+          "Count:3": 1,
+          "Damage:2": 0,
+          "OreDict:8": "",
+          "id:8": "Botania:brewVial",
+          "tag:10": {
+            "brewKey:8": "haste"
+          }
         }
       }
     },
     "1:10": {
`,
    );
    await downloadCtx.patchFile(
      '.minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/Tools-AAAAAAAAAAAAAAAAAAAABQ==.json',
      `Index: .minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/Tools-AAAAAAAAAAAAAAAAAAAABQ==.json
===================================================================
--- .minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/Tools-AAAAAAAAAAAAAAAAAAAABQ==.json
+++ .minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/Tools-AAAAAAAAAAAAAAAAAAAABQ==.json
@@ -75,8 +75,17 @@
           "Count:3": 5,
           "Damage:2": 0,
           "OreDict:8": "",
           "id:8": "dreamcraft:item.CoinTechnician"
+        },
+        "2:10": {
+          "Count:3": 1,
+          "Damage:2": 0,
+          "OreDict:8": "",
+          "id:8": "Botania:brewVial",
+          "tag:10": {
+            "brewKey:8": "haste"
+          }
         }
       }
     }
   },
`,
    );
    await downloadCtx.patchFile(
      '.minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/CopperSkyIronCur-AAAAAAAAAAAAAAAAAAAAHA==.json',
      `Index: .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/CopperSkyIronCur-AAAAAAAAAAAAAAAAAAAAHA==.json
===================================================================
--- .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/CopperSkyIronCur-AAAAAAAAAAAAAAAAAAAAHA==.json
+++ .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/CopperSkyIronCur-AAAAAAAAAAAAAAAAAAAAHA==.json
@@ -44,8 +44,17 @@
           "Count:3": 1,
           "Damage:2": 0,
           "OreDict:8": "",
           "id:8": "harvestcraft:sweetpotatopieItem"
+        },
+        "1:10": {
+          "Count:3": 1,
+          "Damage:2": 0,
+          "OreDict:8": "",
+          "id:8": "Botania:brewVial",
+          "tag:10": {
+            "brewKey:8": "haste"
+          }
         }
       }
     }
   },
`,
    );
    await downloadCtx.patchFile(
      '.minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/GravelTheGatheri-AAAAAAAAAAAAAAAAAAAAFA==.json',
      `Index: .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/GravelTheGatheri-AAAAAAAAAAAAAAAAAAAAFA==.json
===================================================================
--- .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/GravelTheGatheri-AAAAAAAAAAAAAAAAAAAAFA==.json
+++ .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/GravelTheGatheri-AAAAAAAAAAAAAAAAAAAAFA==.json
@@ -69,8 +69,17 @@
           "Count:3": 5,
           "Damage:2": 0,
           "OreDict:8": "",
           "id:8": "dreamcraft:item.CoinAdventure"
+        },
+        "1:10": {
+          "Count:3": 1,
+          "Damage:2": 0,
+          "OreDict:8": "",
+          "id:8": "Botania:brewVial",
+          "tag:10": {
+            "brewKey:8": "haste"
+          }
         }
       }
     }
   },
`,
    );
    await downloadCtx.patchFile(
      '.minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/SandTheGathering-AAAAAAAAAAAAAAAAAAAAEQ==.json',
      `Index: .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/SandTheGathering-AAAAAAAAAAAAAAAAAAAAEQ==.json
===================================================================
--- .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/SandTheGathering-AAAAAAAAAAAAAAAAAAAAEQ==.json
+++ .minecraft/config/betterquesting/DefaultQuests/Quests/Tier0StoneAge-AAAAAAAAAAAAAAAAAAAAAQ==/SandTheGathering-AAAAAAAAAAAAAAAAAAAAEQ==.json
@@ -69,8 +69,17 @@
           "Count:3": 10,
           "Damage:2": 0,
           "OreDict:8": "",
           "id:8": "dreamcraft:item.CoinAdventure"
+        },
+        "1:10": {
+          "Count:3": 1,
+          "Damage:2": 0,
+          "OreDict:8": "",
+          "id:8": "Botania:brewVial",
+          "tag:10": {
+            "brewKey:8": "haste"
+          }
         }
       }
     }
   },
`,
    );
  },
});
