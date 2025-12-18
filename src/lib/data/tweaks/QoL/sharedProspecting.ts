import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'SharedProspecting (Mod)',
  description:
    'Share VisualProspecting data between members of a ServerUtilities team. You can see ore veins that other players find.',
  icon: { kind: 'emoji', value: '⛏️' },
  supportedVersions: 'all',
  followsStargateRules: true,
  filesToDownload: () => [
    {
      filename: '.minecraft/mods/sharedprospecting-2.0.3.jar',
      description: 'Mod',
      url: 'https://github.com/Lyfts/SharedProspecting/releases/download/2.0.3/sharedprospecting-2.0.3.jar',
    },
  ],
  onDownload: async () => {},
});
