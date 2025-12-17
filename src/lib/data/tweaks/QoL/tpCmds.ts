import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Teleport Commands (FTB Essentials)',
  description: 'Enable teleport commands like home and tpa.',
  icon: { kind: 'emoji', value: '🌀' },
  supportedVersions: [gtnhVersionIds.v2_8_0, gtnhVersionIds.v2_8_1, gtnhVersionIds.v2_8_2, gtnhVersionIds.v2_8_3],
  followsStargateRules: cfg => !cfg.back || +cfg.backCooldown >= 30,
  configs: {
    back: {
      type: 'checkbox',
      label: 'back',
      default: true,
    },
    home: {
      type: 'number',
      label: 'home (number of homes, 0 to disable)',
      default: 10,
      min: 0,
      max: 2048,
      step: 1,
    },
    spawn: {
      type: 'checkbox',
      label: 'spawn',
      default: true,
    },
    tpa: {
      type: 'checkbox',
      label: 'tpa (to player, need to accept)',
      default: true,
    },
    warp: {
      type: 'checkbox',
      label: 'warp (specific warp locations)',
      default: true,
    },
    warmup: {
      type: 'number',
      label: 'TP Warmup Time (seconds)',
      default: 3,
      min: 0,
      max: 86400,
      step: 1,
    },
    cooldown: {
      type: 'number',
      label: 'TP Cooldown Time (seconds)',
      default: 1,
      min: 0,
      max: 86400,
      step: 1,
    },
    backCooldown: {
      type: 'number',
      label: 'back Cooldown Time (seconds)',
      default: 180,
      min: 0,
      max: 86400,
      step: 1,
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -91,9 +91,9 @@
 
 
 commands {
     #  [default: true]
-    B:back=false
+    B:back=${config.back}
 
     #  [default: true]
     B:backup=true
 
@@ -118,9 +118,9 @@
     #  [default: true]
     B:heal=false
 
     #  [default: true]
-    B:home=false
+    B:home=${+config.home > 0}
 
     #  [default: true]
     B:inv=true
 
@@ -160,12 +160,12 @@
     #  [default: true]
     B:seek_block=true
 
     #  [default: true]
-    B:spawn=false
+    B:spawn=${config.spawn}
 
     #  [default: true]
-    B:tpa=false
+    B:tpa=${config.tpa}
 
     #  [default: true]
     B:tpl=true
 
@@ -175,9 +175,9 @@
     #  [default: true]
     B:vanish=true
 
     #  [default: true]
-    B:warp=false
+    B:warp=${config.warp}
 }
 
 
 debugging {
`,
    );
    if (config.back) {
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.warmup', `${config.warmup}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.cooldown', `${config.backCooldown}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.back', 'true');
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.home', 'true');
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.spawn', 'true');
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.tpa', 'true');
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.back.warp', 'true');
    }
    if (+config.home > 0) {
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.home.max', String(config.home));
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.home.warmup', `${config.warmup}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.home.cooldown', `${config.cooldown}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.home.cross_dim', 'true');
    }
    if (config.spawn) {
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.spawn.warmup', `${config.warmup}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.spawn.cooldown', `${config.cooldown}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.spawn.cross_dim', 'true');
    }
    if (config.tpa) {
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.tpa.warmup', `${config.warmup}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.tpa.cooldown', `${config.cooldown}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.tpa.cross_dim', 'true');
    }
    if (config.warp) {
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.warp.warmup', `${config.warmup}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.warp.cooldown', `${config.cooldown}s`);
      await downloadCtx.patchServerRanks(undefined, 'serverutilities.warp.cross_dim', 'true');
    }
  },
});
