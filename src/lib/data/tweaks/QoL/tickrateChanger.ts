import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'TickrateChanger (Mod)',
  description:
    'Change global tick rate by `/tickrate [tps]` (default is 20) (https://www.curseforge.com/minecraft/mc-mods/tickratechanger)',
  icon: { kind: 'image', src: 'icons/TickrateChanger.png', alt: 'TickrateChanger' },
  supportedVersions: 'all',
  followsStargateRules: false,
  filesToDownload: (version, config) => [
    {
      filename: '.minecraft/mods/TickrateChanger-1.0.2e.jar',
      description: 'Mod',
      url: 'https://www.curseforge.com/api/v1/mods/230233/files/2262282/download',
    },
  ],
  onDownload: async (config, downloadCtx) => {},
});
