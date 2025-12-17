import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Complementary Shaders - Reimagined',
  description: 'Shader, with tweaks to support hardcore darkness. You need to select this shader manually ingame.',
  icon: { kind: 'image', src: 'icons/complementary.webp', alt: 'complementary' },
  supportedVersions: () => true,
  followsStargateRules: true,
  filesToDownload: (version, config) => [
    {
      filename: '.minecraft/shaderpacks/ComplementaryReimagined_r5.6.1.zip',
      description: 'Shader',
      url: 'https://cdn.modrinth.com/data/HVnmMxH1/versions/OfRF7dTR/ComplementaryReimagined_r5.6.1.zip',
    },
  ],
  onDownload: async (config, downloadCtx) => {
    downloadCtx.createRawFile(
      '.minecraft/shaderpacks/ComplementaryReimagined_r5.6.1.zip.txt',
      `#Wed Oct 08 12:35:30 PDT 2025
CAVE_LIGHTING=0
LIGHT_COLOR_MULTS=true
LIGHT_NIGHT_I=0.01
`,
    );
  },
});
