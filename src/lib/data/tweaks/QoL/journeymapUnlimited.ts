import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'JourneyMap Unlimited',
  description: 'View caves and stuff in JourneyMap (https://gtnh.miraheze.org/wiki/JourneyMap#JourneyMap_Fairplay)',
  icon: { kind: 'image', src: 'icons/journeymap.webp', alt: 'journeymap' },
  supportedVersions: () => true,
  followsStargateRules: false,
  filesToDownload: (version, config) => [
    {
      filename: '.minecraft/mods/journeymap-1.7.10-5.2.10-unlimited.jar',
      description: 'Mod',
      url: 'https://cdn.modrinth.com/data/lfHFW1mp/versions/MO9cf9Ur/journeymap-1.7.10-5.2.10-unlimited.jar',
    },
  ],
  filesToDelete: (version, config) => ['.minecraft/mods/journeymap-1.7.10-5.2.10-fairplay.jar'],
  onDownload: async (config, downloadCtx) => {},
});
