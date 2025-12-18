import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Complementary Shaders - Reimagined',
  description: 'Shader, with tweaks to support hardcore darkness. You need to select this shader manually ingame.',
  icon: {
    kind: 'image',
    src: 'https://cdn.modrinth.com/data/HVnmMxH1/79cb7c8123bbc54945305b2ebad6b8881efdf5f8_96.webp',
    alt: 'complementary',
  },
  supportedVersions: 'all',
  followsStargateRules: true,
  filesToDownload: () => [
    {
      filename: '.minecraft/shaderpacks/ComplementaryReimagined_r5.6.1.zip',
      description: 'Shader',
      url: 'https://cdn.modrinth.com/data/HVnmMxH1/versions/OfRF7dTR/ComplementaryReimagined_r5.6.1.zip',
    },
  ],
  onDownload: async (_config, downloadCtx) => {
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
