import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Multiblock Structure Hologram Projector Configs',
  description: 'Configure how many blocks can be automatically placed and how fast they are placed.',
  icon: {
    kind: 'image',
    src: 'https://static.wikitide.net/gtnhwiki/thumb/d/d1/MultiblockStructureHologramProjector.png/300px-MultiblockStructureHologramProjector.png',
    alt: 'Hologram Projector',
  },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  configs: {
    budget: {
      type: 'number',
      label: 'Number of blocks placed in one round (changing to 200 recommended)',
      default: 25,
      min: 1,
      max: 200,
      step: 1,
    },
    interval: {
      type: 'number',
      label: 'Minimum interval (milliseconds) between two auto place rounds',
      default: 300,
      min: 0,
      max: 20000,
      step: 1,
    },
  },
  onDownload: async (config, downloadCtx) => {
    if (config.budget != 25 || config.interval != 300) {
      downloadCtx.createRawFile(
        '.minecraft/config/structurelib.cfg',
        `# Configuration file

~CONFIG_VERSION: V1

client {

    hologram {
        # Ticks before a hologram disappears. [range: 1 ~ 20000, default: 400]
        I:hintLifespan=400

        # Alpha value of hologram particles. Higher the value, the more "ghostly" the hologram will appear to be. [range: 1 ~ 255, default: 192]
        I:hintTransparency=192

        # An attempt will be made to prune old holograms when a new hologram is about to be projected [range: 1 ~ 100, default: 1]
        I:maxCoexisting=1

        # An attempt will be made to remove an existing hologram if it collides with a new hologram. [default: true]
        B:removeColliding=true
    }

}


common {

    hologram {
        # Max number of elements can be placed in one round of auto place.
        # As expected, server side settings will overrides client settings.
        # Certain larger multi might increase these values beyond this configured value. [range: 1 ~ 200, default: 25]
        I:autoPlaceBudget=${config.budget}

        # Unit: millisecond. Minimal interval between two auto place round.
        # As expected, server side settings will overrides client settings.
        # Note this relates to the wall clock, not in game ticks.
        # Value smaller than default is likely to be perceived as no minimal interval whatsoever. [range: 0 ~ 20000, default: 300]
        I:autoPlaceInterval=${config.interval}
    }

}


registries {

    inventoryproviders {
        # stuff in this list will be disabled
        S:disabled <
         >

        # stuff not in this list will be automatically available after all entries listed here in their natural order, unless explicitly disabled in disabled config below.
        S:ordering <
            5000-main-inventory
            5001-baubles
            6000-adventure-backpack
            7000-ender-inventory
         >
    }

    stackextractors {
        # stuff in this list will be disabled
        S:disabled <
         >

        # stuff not in this list will be automatically available after all entries listed here in their natural order, unless explicitly disabled in disabled config below.
        S:ordering <
            0999-ae2fc-need-before-ae2
            0999-ae2wct-need-before-ae2
            1000-adventure-backpack
            1000-ae2-portable-cell
            1000-ae2-wireless
            1000-forestry-backpack
         >
    }

}


`,
      );
    }
  },
});
