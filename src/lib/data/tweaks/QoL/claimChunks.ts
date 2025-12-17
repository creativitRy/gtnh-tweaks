import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Claim Chunks',
  description: 'Allow claiming chunks to do stuff like chunk loading, claimed chunks disabling explosions, etc.',
  icon: { kind: 'emoji', value: '🗺️' },
  supportedVersions: [gtnhVersionIds.v2_8_0, gtnhVersionIds.v2_8_1, gtnhVersionIds.v2_8_2, gtnhVersionIds.v2_8_3],
  followsStargateRules: true,
  configs: {
    max: {
      type: 'number',
      label: 'Max Claimed Chunks',
      default: 1000,
      min: 1,
      max: 1000000,
      step: 1,
    },
    chunkLoad: {
      type: 'number',
      label: 'Chunk Loading (max loaded chunks, 0 to disable)',
      default: 1000,
      min: 0,
      max: 1000000,
      step: 1,
    },
    explosion: {
      type: 'checkbox',
      label: 'Configurable Explosions',
      default: true,
    },
    pvp: {
      type: 'checkbox',
      label: 'Configurable PVP',
      default: true,
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchServerRanks(undefined, 'serverutilities.claims.max_chunks', String(config.max));
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -313,9 +313,9 @@
     I:blocked_claiming_dimensions <
      >
 
     # Enables chunk claiming. [default: true]
-    B:chunk_claiming=false
+    B:chunk_claiming=true
 
     # Enables chunk loading. If chunk_claiming is set to false, changing this won't do anything. [default: true]
     B:chunk_loading=true
 
`,
    );
    if (!config.chunkLoad) {
      await downloadCtx.patchFile(
        '.minecraft/serverutilities/serverutilities.cfg',
        `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -316,9 +316,9 @@
     # Enables chunk claiming. [default: true]
     B:chunk_claiming=false
 
     # Enables chunk loading. If chunk_claiming is set to false, changing this won't do anything. [default: true]
-    B:chunk_loading=true
+    B:chunk_loading=false
 
     # Disables player damage when they are stuck in walls. [default: false]
     B:disable_player_suffocation_damage=false
 
`,
      );
    } else {
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.chunkloader.max_chunks', String(config.chunkLoad));
    }
    if (config.explosion) {
      await downloadCtx.patchFile(
        '.minecraft/serverutilities/serverutilities.cfg',
        `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -333,9 +333,9 @@
     # TRUE = Explosions on for everyone.
     # FALSE = Explosions disabled for everyone.
     # Possible values: [TRUE, FALSE, DEFAULT]
     #  [default: DEFAULT]
-    S:enable_explosions=TRUE
+    S:enable_explosions=DEFAULT
 
     # Enabled Player Sleeping Percentage to skip night. Use the gamerule playersSleepingPercentage to set the percentage. [default: false]
     B:enable_player_sleeping_percentage=false
 
`,
      );
    }
    if (config.pvp) {
      await downloadCtx.patchFile(
        '.minecraft/serverutilities/serverutilities.cfg',
        `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -344,9 +344,9 @@
     # TRUE = PVP on for everyone.
     # FALSE = PVP disabled for everyone.
     # Possible values: [TRUE, FALSE, DEFAULT]
     #  [default: DEFAULT]
-    S:enable_pvp=TRUE
+    S:enable_pvp=DEFAULT
 
     # Locked time in ticks in spawn dimension.
     # -1 - Disabled
     # 0 - Morning
`,
      );
    }
  },
});
