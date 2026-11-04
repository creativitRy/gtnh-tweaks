import { defineTweak } from '@gtnh-tweaks/core';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'LagGoggles (Mod)',
  description:
    "Use to highlight tile entities based on their mspt lag. Red/orange is potentially problematic. Open/run with the 'Profile GUI' keybind.",
  icon: {
    kind: 'image',
    src: 'https://static.wikitide.net/gtnhwiki/5/50/LagGoggles.png',
    alt: 'laggoggles',
  },
  supportedVersions: 'all',
  followsStargateRules: true,
  filesToDownload: () => [
    {
      filename: '.minecraft/mods/laggoggles-mc1.7.10-4.17.0.jar',
      description: 'Mod',
      url: 'https://github.com/FalsePattern/LagGogglesLegacy/releases/download/4.17.0/laggoggles-mc1.7.10-4.17.0.jar',
    },
  ],
  onDownload: async () => {},
});
