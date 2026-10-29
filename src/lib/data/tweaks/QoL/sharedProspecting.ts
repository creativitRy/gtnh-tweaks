import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'SharedProspecting (Mod)',
  description:
    'Share VisualProspecting data between members of a ServerUtilities team. You can see ore veins that other players find. Enabled by default in v2.9+.',
  icon: { kind: 'emoji', value: '⛏️' },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
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
