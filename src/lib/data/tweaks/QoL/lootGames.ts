import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Configure Loot Games Generation',
  description:
    'Veteran GTNH players know that the game of light sucks. This lets you configure the probability of each game getting generated.',
  icon: {
    kind: 'image',
    src: 'https://media.forgecdn.net/avatars/thumbnails/214/923/64/64/636994959924169529.png',
    alt: 'Loot Games',
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
    gameOfLight: {
      type: 'number',
      label: 'Game Of Light Weight',
      default: 0,
      min: 0,
      max: 100,
      step: 1,
    },
    gameOfLightRounds: {
      type: 'slider',
      label: 'Game Of Light Rounds per Stage',
      default: 5,
      min: 1,
      max: 5,
      step: 1,
    },
    minesweeper: {
      type: 'number',
      label: 'Minesweeper Weight',
      default: 1,
      min: 0,
      max: 100,
      step: 1,
    },
    sudoku: {
      type: 'number',
      label: 'Sudoku Weight',
      default: 1,
      min: 0,
      max: 100,
      step: 1,
    },
  },
  onDownload: async (config, downloadCtx) => {
    if (config.gameOfLight != 1 || config.gameOfLightRounds != 5) {
      downloadCtx.createRawFile(
        '.minecraft/config/lootgames/games/game_of_light.cfg',
        `# Configuration file

##########################################################################################################
# game_of_light
#--------------------------------------------------------------------------------------------------------#
# Regulates "Game of Light" minigame.
##########################################################################################################

game_of_light {
    # It represents the number of attempts the player has to beat the game successfully. [range: 1 ~ 2147483647, default: 3]
    I:attempt_count=3

    # At which stage should the playfield become a full 3x3 pattern?
    # Set 0 to disable and keep the 4-block size; set 1 to always start with 3x3. [range: 0 ~ 4, default: 2]
    I:expand_field_at_stage=2

    # Enables or disables structure exploding on max failed attempts. [default: true]
    B:explode_on_fail=true

    # Enables or disables structure filling with lava on max failed attempts. [default: true]
    B:lava_on_fail=true

    # Regulates how many digits should be randomly chosen and shown at game-start. [range: 1 ~ 2147483647, default: 2]
    I:start_digit_amount=2

    # How long does it take to timeout a game? Value is in seconds.
    # If player has been inactive for given time, the game will go to sleep. The next player can start the game from the beginning. [range: 10 ~ 2147483647, default: 30]
    I:timeout=30

    # How likely this game is chosen compared to other games. The higher this value is, the more likely this game is chosen. Set to 0 to turn this off. [range: 0 ~ 2147483647, default: 1]
    I:weight=${config.gameOfLight}

    # Enables or disables structure filling with zombies on max failed attempts. [default: true]
    B:zombies_on_fail=true

    ##########################################################################################################
    # stage_1
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 1.
    ##########################################################################################################

    stage_1 {
        # Amount of time (in ticks; 20 ticks = 1s) for which the symbol will be displayed. [range: 2 ~ 40, default: 24]
        I:display_time=24

        # If true, the pattern will randomize on each round in this stage. [default: false]
        B:randomize_sequence=false

        # Round count required to complete this stage and unlock leveled reward. [range: 1 ~ 256, default: 5]
        I:round_count=${config.gameOfLightRounds}
    }

    ##########################################################################################################
    # stage_2
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 2.
    ##########################################################################################################

    stage_2 {
        # Amount of time (in ticks; 20 ticks = 1s) for which the symbol will be displayed. [range: 2 ~ 40, default: 16]
        I:display_time=16

        # If true, the pattern will randomize on each round in this stage. [default: false]
        B:randomize_sequence=false

        # Round count required to complete this stage and unlock leveled reward. [range: 1 ~ 256, default: 5]
        I:round_count=${config.gameOfLightRounds}
    }

    ##########################################################################################################
    # stage_3
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 3.
    ##########################################################################################################

    stage_3 {
        # Amount of time (in ticks; 20 ticks = 1s) for which the symbol will be displayed. [range: 2 ~ 40, default: 12]
        I:display_time=12

        # If true, the pattern will randomize on each round in this stage. [default: false]
        B:randomize_sequence=false

        # Round count required to complete this stage and unlock leveled reward. [range: 1 ~ 256, default: 5]
        I:round_count=${config.gameOfLightRounds}
    }

    ##########################################################################################################
    # stage_4
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 4.
    ##########################################################################################################

    stage_4 {
        # Amount of time (in ticks; 20 ticks = 1s) for which the symbol will be displayed. [range: 2 ~ 40, default: 12]
        I:display_time=12

        # If true, the pattern will randomize on each round in this stage. [default: true]
        B:randomize_sequence=true

        # Round count required to complete this stage and unlock leveled reward. [range: 1 ~ 256, default: 5]
        I:round_count=${config.gameOfLightRounds}
    }

}


`,
      );
    }
    if (config.minesweeper != 1) {
      downloadCtx.createRawFile(
        '.minecraft/config/lootgames/games/minesweeper.cfg',
        `# Configuration file

##########################################################################################################
# minesweeper
#--------------------------------------------------------------------------------------------------------#
# Regulates "Minesweeper" minigame.
##########################################################################################################

minesweeper {
    # It represents the number of attempts the player has to beat the game successfully. [range: 1 ~ 2147483647, default: 3]
    I:attempt_count=3

    # The time until bombs start to explode. Represented in ticks. [range: 0 ~ 600, default: 60]
    I:detonation_time=60

    # How likely this game is chosen compared to other games. The higher this value is, the more likely this game is chosen. Set to 0 to turn this off. [range: 0 ~ 2147483647, default: 1]
    I:weight=${config.minesweeper}

    ##########################################################################################################
    # stage_1
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 1.
    ##########################################################################################################

    stage_1 {
        # The radius of Minesweeper board. Won't be changed for already generated Minesweeper boards! [range: 2 ~ 9, default: 6]
        I:board_radius=6

        # The amount of bombs on the board. Bomb count must be strictly less than amount of game fields (board_radius ^ 2).  [range: 1 ~ 2147483647, default: 20]
        I:bomb_count=20
    }

    ##########################################################################################################
    # stage_2
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 2.
    ##########################################################################################################

    stage_2 {
        # The radius of Minesweeper board. Won't be changed for already generated Minesweeper boards! [range: 2 ~ 9, default: 7]
        I:board_radius=7

        # The amount of bombs on the board. Bomb count must be strictly less than amount of game fields (board_radius ^ 2).  [range: 1 ~ 2147483647, default: 30]
        I:bomb_count=30
    }

    ##########################################################################################################
    # stage_3
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 3.
    ##########################################################################################################

    stage_3 {
        # The radius of Minesweeper board. Won't be changed for already generated Minesweeper boards! [range: 2 ~ 9, default: 8]
        I:board_radius=8

        # The amount of bombs on the board. Bomb count must be strictly less than amount of game fields (board_radius ^ 2).  [range: 1 ~ 2147483647, default: 42]
        I:bomb_count=42
    }

    ##########################################################################################################
    # stage_4
    #--------------------------------------------------------------------------------------------------------#
    # Regulates characteristics of stage 4.
    ##########################################################################################################

    stage_4 {
        # The radius of Minesweeper board. Won't be changed for already generated Minesweeper boards! [range: 2 ~ 9, default: 9]
        I:board_radius=9

        # The amount of bombs on the board. Bomb count must be strictly less than amount of game fields (board_radius ^ 2).  [range: 1 ~ 2147483647, default: 68]
        I:bomb_count=68
    }

}


`,
      );
    }
    if (config.sudoku != 1 && !downloadCtx.version.startsWith('2.8.')) {
      downloadCtx.createRawFile(
        '.minecraft/config/lootgames/games/sudoku.cfg',
        `# Configuration file
sudoku {
    I:weight=${config.sudoku}
}
`,
      );
    }
  },
});
