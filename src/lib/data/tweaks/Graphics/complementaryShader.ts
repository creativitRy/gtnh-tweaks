import { defineTweak, gtnhVersionIds } from '@gtnh-tweaks/core';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Complementary Shaders - Reimagined',
  description: 'Shader, with tweaks to support hardcore darkness. You need to select this shader manually ingame.',
  icon: {
    kind: 'image',
    src: 'https://cdn.modrinth.com/data/HVnmMxH1/79cb7c8123bbc54945305b2ebad6b8881efdf5f8_96.webp',
    alt: 'complementary',
  },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
    gtnhVersionIds.v2_9_0,
  ],
  followsStargateRules: true,
  filesToDownload: version => {
    if (version === gtnhVersionIds.v2_9_0) {
      return [
        {
          filename: '.minecraft/shaderpacks/ComplementaryReimagined_r5.9.3.zip',
          description: 'Shader',
          url: 'https://cdn.modrinth.com/data/HVnmMxH1/versions/Bqen1mJX/ComplementaryReimagined_r5.9.3.zip',
        },
      ];
    }

    return [
      {
        filename: '.minecraft/shaderpacks/ComplementaryReimagined_r5.6.1.zip',
        description: 'Shader',
        url: 'https://cdn.modrinth.com/data/HVnmMxH1/versions/OfRF7dTR/ComplementaryReimagined_r5.6.1.zip',
      },
    ];
  },
  onDownload: async (_config, downloadCtx) => {
    downloadCtx.createRawFile(
      downloadCtx.version === gtnhVersionIds.v2_9_0
        ? '.minecraft/shaderpacks/ComplementaryReimagined_r5.9.3.zip.txt'
        : '.minecraft/shaderpacks/ComplementaryReimagined_r5.6.1.zip.txt',
      `ATM_COLOR_MULTS=true
ATM_MORNING_I=0.50
ATM_NIGHT_I=0.05
HELD_LIGHTING_MODE=1
LIGHT_COLOR_MULTS=true
LIGHT_MORNING_I=0.50
LIGHT_NIGHT_I=0.01
`,
    );
  },
});
