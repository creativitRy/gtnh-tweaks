import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Modernity-GTNH (Resourcepack)',
  description: 'Resourcepack for modern textures.',
  icon: { kind: 'image', src: 'icons/modernity-gtnh.png', alt: 'modernity-gtnh' },
  supportedVersions: () => true,
  followsStargateRules: true,
  filesToDownload: (version, config) => [
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
  ],
  onDownload: async (config, downloadCtx) => {
  },
});
