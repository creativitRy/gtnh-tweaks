import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'JourneyMap Unlimited',
  description: 'View caves and stuff in JourneyMap (https://gtnh.miraheze.org/wiki/JourneyMap#JourneyMap_Fairplay)',
  icon: {
    kind: 'image',
    src: 'https://cdn.modrinth.com/data/lfHFW1mp/a1c571a21a88f6fa59eab67829f216f65ab393ee_96.webp',
    alt: 'journeymap',
  },
  supportedVersions: 'all',
  followsStargateRules: false,
  filesToDownload: () => [
    {
      filename: '.minecraft/mods/journeymap-1.7.10-5.2.10-unlimited.jar',
      description: 'Mod',
      url: 'https://cdn.modrinth.com/data/lfHFW1mp/versions/MO9cf9Ur/journeymap-1.7.10-5.2.10-unlimited.jar',
    },
  ],
  filesToDelete: () => ['.minecraft/mods/journeymap-1.7.10-5.2.10-fairplay.jar'],
  onDownload: async () => {},
});
