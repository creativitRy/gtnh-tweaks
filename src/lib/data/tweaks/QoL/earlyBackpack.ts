import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Early Backpack Quest Reward',
  description:
    'This adds a new quest at the beginning hour that tells you to build at a high humidity biome and gives you a backpack!',
  icon: { kind: 'emoji', value: '🎒' },
  supportedVersions: [gtnhVersionIds.v2_8_3],
  followsStargateRules: false,
  onDownload: async (config, downloadCtx) => {
    downloadCtx.createRawFile(
      '.minecraft/config/betterquesting/DefaultQuests/QuestLines/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/Explorations-4sor0RUpSqawi2VTD9SC8g==.json',
      `{
  "questIDHigh:4": -2104821698839098714,
  "questIDLow:4": -5725371093849177358,
  "sizeX:3": 24,
  "sizeY:3": 24,
  "x:3": 228,
  "y:3": 36
}`,
    );
    downloadCtx.createRawFile(
      '.minecraft/config/betterquesting/DefaultQuests/Quests/AndSoItBegins-AAAAAAAAAAAAAAAAAAAAAA==/Explorations-4sor0RUpSqawi2VTD9SC8g==.json',
      `{
  "preRequisites:9": {
    "0:10": {
      "questIDHigh:4": 0,
      "questIDLow:4": 4
    }
  },
  "properties:10": {
    "betterquesting:10": {
      "autoClaim:1": 0,
      "desc:8": "Your longer-term base should be in a biome with high humidity. 70% or higher as stated on the top right of your HUD is recommended.\\n\\nAlong the way, many villages and structures will have loot that you would not want to miss out! We tweaked in this quest here so that you can get a backpack super early.",
      "globalShare:1": 0,
      "icon:10": {
        "Count:3": 1,
        "Damage:2": 0,
        "OreDict:8": "",
        "id:8": "Backpack:backpack"
      },
      "isMain:1": 0,
      "isSilent:1": 0,
      "lockedProgress:1": 0,
      "name:8": "§9§lExplorations!",
      "questLogic:8": "AND",
      "repeatTime:3": -1,
      "repeat_relative:1": 1,
      "simultaneous:1": 0,
      "snd_complete:8": "random.levelup",
      "snd_update:8": "random.levelup",
      "taskLogic:8": "AND",
      "visibility:8": "NORMAL"
    }
  },
  "questIDHigh:4": -2104821698839098714,
  "questIDLow:4": -5725371093849177358,
  "rewards:9": {
    "0:10": {
      "ignoreDisabled:1": 0,
      "index:3": 0,
      "rewardID:8": "bq_standard:item",
      "rewards:9": {
        "0:10": {
          "Count:3": 1,
          "Damage:2": 0,
          "OreDict:8": "",
          "id:8": "Backpack:backpack"
        }
      }
    }
  },
  "tasks:9": {
    "0:10": {
      "index:3": 0,
      "taskID:8": "bq_standard:checkbox"
    }
  }
}`,
    );
  },
});
