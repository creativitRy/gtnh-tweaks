import { defineTweak } from '$lib/tweak';
import { gtnhVersionIds } from '$lib/data/versions';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Only Backup Claimed Chunks',
  description: 'Backups will be much faster and smaller, but any unclaimed chunk will be unrecoverable.',
  icon: { kind: 'emoji', value: '💾' },
  supportedVersions: [gtnhVersionIds.v2_8_0],
  followsStargateRules: true,
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/serverutilities/serverutilities.cfg',
      `Index: .minecraft/serverutilities/serverutilities.cfg
===================================================================
--- .minecraft/serverutilities/serverutilities.cfg
+++ .minecraft/serverutilities/serverutilities.cfg
@@ -70,9 +70,9 @@
     B:need_online_players=true
 
     # Only include claimed chunks in backup.
     # Backups will be much faster and smaller, but any unclaimed chunk will be unrecoverable. [default: false]
-    B:only_backup_claimed_chunks=false
+    B:only_backup_claimed_chunks=true
 
     # Silence backup notifications. [default: false]
     B:silent_backup=false
 
`,
    );
  },
});
