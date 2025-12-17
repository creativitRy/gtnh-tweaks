import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Player Sleep Percentage',
  description:
    'Configure percentage of players required to sleep for the server to tick (default: 50%). ' +
    'Set to 0 if only 1 player needs to sleep.',
  icon: { kind: 'emoji', value: '🛌' },
  supportedVersions: [gtnhVersionIds.v2_8_0],
  followsStargateRules: true,
  configs: {
    percentage: {
      type: 'slider',
      label: 'Percentage',
      default: 0,
      min: 0,
      max: 100,
      step: 10,
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -336,9 +336,9 @@
     #  [default: DEFAULT]
     S:enable_explosions=TRUE
 
     # Enabled Player Sleeping Percentage to skip night. Use the gamerule playersSleepingPercentage to set the percentage. [default: false]
-    B:enable_player_sleeping_percentage=false
+    B:enable_player_sleeping_percentage=true
 
     # Allowed values:
     # DEFAULT = Players can choose their own PVP status.
     # TRUE = PVP on for everyone.
@@ -362,9 +362,9 @@
     # 2 - Thunderstorm [range: -1 ~ 2, default: -1]
     I:forced_spawn_dimension_weather=-1
 
     # Default Player Sleeping. This is only what the gamerule is initially set to, not the active value that is used. [range: 0 ~ 100, default: 50]
-    I:player_sleeping_percentage=50
+    I:player_sleeping_percentage=${config.percentage}
 
     # Max /rtp distance [range: 4.9E-324 ~ 1.7976931348623157E308, default: 100000.0]
     D:rtp_max_distance=100000.0
 
`,
    );
  },
});
