import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Backup Timer',
  description: 'Configure how frequently backup should run (default: 0.5h).',
  icon: { kind: 'emoji', value: '⏲️' },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  configs: {
    timer: {
      type: 'slider',
      label: 'Timer (hours)',
      default: 1,
      min: 0.5,
      max: 6,
      step: 0.5,
    },
  },
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -44,9 +44,9 @@
     S:backup_folder_path=./backups/
 
     # Time between backups in hours. 
     # 1.0 - backups every hour 6.0 - backups every 6 hours 0.5 - backups every 30 minutes. [range: 0.0 ~ 1.7976931348623157E308, default: 0.5]
-    S:backup_timer=0.5
+    S:backup_timer=${config.timer}
 
     # Number of backup files to keep before deleting old ones. [range: 1 ~ 2147483647, default: 12]
     I:backups_to_keep=12
 
`,
    );
  },
});
