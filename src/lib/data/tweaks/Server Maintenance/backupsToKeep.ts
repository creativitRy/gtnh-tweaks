import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Backups to Keep',
  description: 'Configure number of backup files to keep before deleting old ones (default: 12).',
  icon: { kind: 'emoji', value: '♻️️' },
  supportedVersions: [
    gtnhVersionIds.v2_8_0,
    gtnhVersionIds.v2_8_1,
    gtnhVersionIds.v2_8_2,
    gtnhVersionIds.v2_8_3,
    gtnhVersionIds.v2_8_4,
  ],
  followsStargateRules: true,
  configs: {
    amount: {
      type: 'slider',
      label: 'Amount',
      default: 12,
      min: 1,
      max: 40,
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
@@ -47,9 +47,9 @@
     # 1.0 - backups every hour 6.0 - backups every 6 hours 0.5 - backups every 30 minutes. [range: 0.0 ~ 1.7976931348623157E308, default: 0.5]
     S:backup_timer=0.5
 
     # Number of backup files to keep before deleting old ones. [range: 1 ~ 2147483647, default: 12]
-    I:backups_to_keep=12
+    I:backups_to_keep=${config.amount}
 
     # How much the backup file will be compressed. 0 - uncompressed, 1 - best speed, 9 - smallest file size. [range: 0 ~ 9, default: 1]
     I:compression_level=1
 
`,
    );
  },
});
