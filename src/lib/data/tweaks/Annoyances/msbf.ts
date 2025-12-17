import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'MouseSideButtonFix (Mod)',
  description: 'Use mouse side buttons as a shortcut key. Other keys might need to be pressed for it to work properly.',
  icon: { kind: 'emoji', value: '🖱️' },
  supportedVersions: () => true,
  followsStargateRules: true,
  filesToDownload: (version, config) => [
    {
      filename: '.minecraft/mods/msbf-v1.0.jar',
      description: 'Mod',
      url: 'https://github.com/asdflj/MouseSideButtonFix/releases/download/v1.0/msbf-v1.0.jar',
    },
  ],
  onDownload: async (config, downloadCtx) => {},
});
