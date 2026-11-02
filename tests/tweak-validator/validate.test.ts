import { test } from 'bun:test';
import { formatFailures, loadTweaks, validateTweak } from './harness';

// Requires network: every tweak runs against every supported GTNH version. `filesToDownload` and
// `filesToDelete` are not exercised, and the semantic review of `patchServerRanks` /
// `patchDefaultKeybind` values stays manual.
const tweaks = await loadTweaks();

for (const tweak of tweaks.values()) {
  test(`${tweak.group} / ${tweak.name}`, { timeout: 120_000 }, async () => {
    const failures = await validateTweak(tweak, tweaks);
    if (failures.length > 0) throw new Error(`\n${formatFailures(failures)}`);
  });
}
