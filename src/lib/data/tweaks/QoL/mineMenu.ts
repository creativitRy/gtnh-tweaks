import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'MineMenu (Mod)',
  description:
    'Instead of key binding conflicts, use a radial menu (https://www.curseforge.com/minecraft/mc-mods/minemenu)',
  icon: {
    kind: 'image',
    src: 'https://media.forgecdn.net/avatars/thumbnails/8/675/64/64/635409783199074139.png',
    alt: 'MineMenu',
  },
  supportedVersions: 'all',
  followsStargateRules: true,
  filesToDownload: (version, config) => [
    {
      filename: '.minecraft/mods/MineMenu-1.7.10-1.2.0.B44-universal.jar',
      description: 'Mod',
      url: 'https://www.curseforge.com/api/v1/mods/222378/files/2214959/download',
    },
  ],
  onDownload: async (config, downloadCtx) => {
    downloadCtx.createRawFile(
      '.minecraft/config/MineMenu/MineMenu.cfg',
      `# Configuration file

general {
    B:releaseToSelect=true
    B:rightClickToEdit=true
    B:toggle=false
}


##########################################################################################################
# server
#--------------------------------------------------------------------------------------------------------#
# All these values control security when a client connects to a MineMenu capable server
##########################################################################################################

server {
}


##########################################################################################################
# visual
#--------------------------------------------------------------------------------------------------------#
# All values here correspond to the RGBA standard, and must be whole numbers between 0 and 255
##########################################################################################################

visual {

    menu {
        I:alpha=153
        I:blue=0
        I:green=0
        I:red=0
    }

    select {
        I:alpha=153
        I:blue=0
        I:green=0
        I:red=255
    }

}


`,
    );
    downloadCtx.createRawFile(
      '.minecraft/MineMenu/menu.json',
      `{
  "Configs": {
    "0": {
      "title": "GT Goggles",
      "icon": {
        "name": "gregtech:gt.Power_Goggles",
        "damage": 0
      },
      "action": {
        "key": {
          "key": "GT5U.power_goggles.open_config_gui",
          "toggle": false
        }
      }
    },
    "1": {
      "title": "Shaders",
      "icon": {
        "name": "minecraft:potato",
        "damage": 0
      },
      "action": {
        "key": {
          "key": "Shaderpack Selection Screen",
          "toggle": false
        }
      }
    },
    "2": {
      "title": "Waila",
      "icon": {
        "name": "EMT:ElectricGogglesRevealing",
        "damage": 1
      },
      "action": {
        "key": {
          "key": "waila.keybind.wailaconfig",
          "toggle": false
        }
      }
    },
    "3": {
      "title": "Draconic Tools Armor",
      "icon": {
        "name": "DraconicEvolution:draconicChest",
        "damage": 0
      },
      "action": {
        "key": {
          "key": "key.toolConfig",
          "toggle": false
        }
      }
    }
  },
  "main": {
    "0": {
      "title": "Zoom",
      "icon": {
        "name": "thaumicenergistics:cell.microscope",
        "damage": 0
      },
      "action": {
        "key": {
          "key": "Zoom",
          "toggle": true
        }
      }
    },
    "7": {
      "title": "Configs",
      "icon": {
        "name": "BuildCraft|Core:wrenchItem",
        "damage": 0
      },
      "action": {
        "category": "Configs"
      }
    }
  }
}`,
    );
    downloadCtx.patchDefaultKeybind('key_key.open_menu', 19); // R
  },
});
