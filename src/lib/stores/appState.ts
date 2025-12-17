import { derived, get, writable } from 'svelte/store';
import { ALL_TWEAKS } from '$lib/data/tweaks';
import { GTNH_VERSIONS } from '$lib/data/versions';
import {
  type ConfigValue,
  DownloadContext,
  type SelectedTweaksMap,
  type TweakConfig,
  type TweakDef,
  type TweakId,
} from '$lib/tweak';
import LZString from 'lz-string';
import { browser } from '$app/environment';
import { saveAs } from 'file-saver';
import { replaceState } from '$app/navigation';
import { tick } from 'svelte';

export const selectedVersion = writable<string>(GTNH_VERSIONS[0].id);
export const stargateFilter = writable<boolean>(false);
export const selections = writable<SelectedTweaksMap>({});
export const presetName = writable<string>('custom');
// Zip generation progress: undefined when idle, or a number 0..1 while generating
export const zipProgress = writable<number | undefined>(undefined);

export const availableTweaks = derived(selectedVersion, $ver => {
  return ALL_TWEAKS.values().filter(t => t.supportedVersions($ver));
});

export const tweaksByGroup = derived(availableTweaks, $tweaks => {
  const groups: Record<string, TweakDef[]> = {};
  const sortedTweaks = [...$tweaks];
  sortedTweaks.sort((a, b) => a.name.localeCompare(b.name));
  sortedTweaks.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });
  return groups;
});

export const validationState = derived([selections, stargateFilter, selectedVersion], ([$sel, $sgFilter, $ver]) => {
  const errors: Record<TweakId, string[]> = {};
  const selectedIds = Object.keys($sel);

  selectedIds.forEach(id => {
    errors[id] = [];
    const tweak = ALL_TWEAKS.get(id);
    if (!tweak) return;

    const config = $sel[id];

    if (!tweak.supportedVersions($ver)) {
      errors[id].push(`Not supported in version ${$ver}`);
    }

    if (tweak.incompatibleWith) {
      tweak.incompatibleWith.forEach(badId => {
        if ($sel[badId]) {
          const badName = ALL_TWEAKS.get(badId)?.name || badId;
          errors[id].push(`Incompatible with ${badName}`);
        }
      });
    }

    const sgState = typeof tweak.followsStargateRules === 'boolean' ? tweak.followsStargateRules : tweak.followsStargateRules(config);
    if ($sgFilter && !sgState) {
      errors[id].push('Violates Stargate Rules (Filter Active)');
    }
  });

  return errors;
});

export function toggleTweak(id: TweakId) {
  selections.update(s => {
    if (s[id]) {
      const rest = { ...s } as Record<string, TweakConfig>;
      delete rest[id];
      return rest;
    } else {
      const tweak = ALL_TWEAKS.get(id);
      const defaults: TweakConfig = {};
      if (tweak?.configs) {
        Object.entries(tweak.configs).forEach(([key, schema]) => {
          defaults[key] = schema.default;
        });
      }
      return { ...s, [id]: defaults };
    }
  });
  updateUrl();
}

export function updateConfig(id: TweakId, key: string, value: ConfigValue) {
  selections.update(s => {
    if (!s[id]) return s;
    return { ...s, [id]: { ...s[id], [key]: value } };
  });
  updateUrl();
}

export function updateUrl() {
  if (!browser) return;
  const s = get(selections);
  const v = get(selectedVersion);
  const sg = get(stargateFilter);

  const json = JSON.stringify(s);
  const compressed = LZString.compressToEncodedURIComponent(json);

  const params = new URLSearchParams();
  params.set('v', v);
  if (sg) params.set('sg', '1');
  params.set('q', compressed);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  tick().then(() => {
    replaceState(newUrl, {});
  });
}

export function loadFromUrl() {
  if (!browser) return;
  const params = new URLSearchParams(window.location.search);

  const v = params.get('v');
  if (v) selectedVersion.set(v);

  const sg = params.get('sg');
  if (sg) stargateFilter.set(true);

  const q = params.get('q');
  if (q) {
    try {
      const json = LZString.decompressFromEncodedURIComponent(q);
      if (json) {
        const parsedSelections = JSON.parse(json) as SelectedTweaksMap;
        const sanitizedSelections: SelectedTweaksMap = {};
        for (const id of Object.keys(parsedSelections)) {
          if (ALL_TWEAKS.has(id)) sanitizedSelections[id] = parsedSelections[id];
        }
        selections.set(sanitizedSelections);
      }
    } catch (e) {
      console.error('Failed to parse URL state', e);
    }
  }
}

export async function download(version: string, selections: SelectedTweaksMap) {
  const PART1_PROGRESS = 0.7;
  const downloadCtx = new DownloadContext(version, selections, ALL_TWEAKS);
  try {
    zipProgress.set(0);

    const selKeys = Object.keys(selections);
    const total = selKeys.length || 1;
    let index = 0;
    for (const id of selKeys) {
      const tweak = ALL_TWEAKS.get(id)!;
      await tweak.onDownload(selections[id], downloadCtx);
      index += 1;
      zipProgress.set((index * PART1_PROGRESS) / total);
    }

    zipProgress.set(PART1_PROGRESS);
    const blob = await downloadCtx.generate(zipProgress, PART1_PROGRESS);
    zipProgress.set(1);
    saveAs(blob, 'gtnh-tweaks.zip');
  } catch (e) {
    console.error(e);
    alert('Failed to generate download: ' + e);
  } finally {
    // Hide the modal after a short tick to let UI show 100% momentarily
    setTimeout(() => zipProgress.set(undefined), 1000);
  }
}
