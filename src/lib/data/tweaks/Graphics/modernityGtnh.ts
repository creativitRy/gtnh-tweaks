import { defineTweak, gtnhVersionIds } from '@gtnh-tweaks/core';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Modernity-GTNH (Resourcepack)',
  description: 'Resourcepack for modern textures. You need to select this resource pack manually ingame.',
  icon: {
    kind: 'image',
    src: 'https://static.wikitide.net/gtnhwiki/thumb/6/61/Pack-ABKQPO.png/64px-Pack-ABKQPO.png',
    alt: 'modernity-gtnh',
  },
  supportedVersions: [
    gtnhVersionIds.v2_9_0,
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  filesToDownload: version => {
    if (version === gtnhVersionIds.v2_9_0) {
      return [
        {
          filename: '.minecraft/resourcepacks/Modernity-2.9.x-fa35a3d.zip',
          description: 'Resourcepack',
          url: 'https://github.com/ModernityGTNH/Modernity-GTNH/releases/download/weekly-2.9.x-2026-10-26/Modernity-2.9.x-fa35a3d.zip',
        },
        {
          filename: '.minecraft/mods/MyCTMLib-1.4.3-29x.jar',
          description: 'Connected textures mod',
          url: 'https://github.com/ModernityGTNH/Modernity-GTNH/releases/download/weekly-2.9.x-2026-10-26/MyCTMLib-1.4.3-29x.jar',
        },
      ];
    }

    return [
      {
        filename: '.minecraft/resourcepacks/Modernity-GTNH-28x-Fix.zip',
        description: 'Resourcepack',
        url: 'https://github.com/ABKQPO/Modernity-GTNH/releases/download/v1.5.9/Modernity-GTNH-28x-Fix.zip',
      },
      {
        filename: '.minecraft/mods/MyCTMLib-v1.2.5_28x.jar',
        description: 'Connected textures mod',
        url: 'https://github.com/ABKQPO/Modernity-GTNH/releases/download/v1.5.9/MyCTMLib-v1.2.5_28x.jar',
      },
    ];
  },
  onDownload: async () => {},
});
