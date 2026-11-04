import { defineTweak, gtnhVersionIds } from '@gtnh-tweaks/core';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'JourneyMap Unlimited',
  description: 'View caves and stuff in JourneyMap (https://gtnh.miraheze.org/wiki/JourneyMap#JourneyMap_Fairplay)',
  icon: {
    kind: 'image',
    src: 'https://cdn.modrinth.com/data/lfHFW1mp/a1c571a21a88f6fa59eab67829f216f65ab393ee_96.webp',
    alt: 'journeymap',
  },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
    gtnhVersionIds.v2_9_0,
  ],
  followsStargateRules: false,
  filesToDownload: version => {
    if (version === gtnhVersionIds.v2_9_0) {
      return [
        {
          filename: '.minecraft/mods/journeymap-1.7.10-5.2.23-unlimited.jar',
          description: 'Mod',
          url: 'https://github.com/TeamJM/journeymap-legacy/releases/download/5.2.23/journeymap-1.7.10-5.2.23-unlimited.jar',
        },
      ];
    }

    return [
      {
        filename: '.minecraft/mods/journeymap-1.7.10-5.2.10-unlimited.jar',
        description: 'Mod',
        url: 'https://cdn.modrinth.com/data/lfHFW1mp/versions/MO9cf9Ur/journeymap-1.7.10-5.2.10-unlimited.jar',
      },
    ];
  },
  filesToDelete: version =>
    version === gtnhVersionIds.v2_9_0
      ? ['.minecraft/mods/journeymap-1.7.10-5.2.23-fairplay.jar']
      : ['.minecraft/mods/journeymap-1.7.10-5.2.10-fairplay.jar'],
  onDownload: async () => {},
});
