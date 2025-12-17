import { derived, get, writable } from 'svelte/store';
import { ALL_TWEAKS } from '$lib/data/tweaks';
import { GTNH_VERSIONS } from '$lib/data/versions';
import {
  type ConfigValue,
  DownloadContext,
  type SelectedTweaksMap,
  supportsVersion,
  type TweakConfig,
  type TweakDef,
  type TweakId,
} from '$lib/tweak';
import { browser } from '$app/environment';
import { saveAs } from 'file-saver';
import { replaceState } from '$app/navigation';
import { tick } from 'svelte';
import brotliPromise from 'brotli-wasm';
import { base64ToBytes, bytesToBase64 } from 'byte-base64';

export const selectedVersion = writable<string>(GTNH_VERSIONS[0].id);
export const stargateFilter = writable<boolean>(false);
export const selections = writable<SelectedTweaksMap>({});
export const presetName = writable<string>('custom');
// Zip generation progress: undefined when idle, or a number 0..1 while generating
export const zipProgress = writable<number | undefined>(undefined);

export const availableTweaks = derived(selectedVersion, $ver => {
  return ALL_TWEAKS.values().filter(t => supportsVersion(t, $ver));
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

    if (!supportsVersion(tweak, $ver)) {
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

    const sgState =
      typeof tweak.followsStargateRules === 'boolean' ? tweak.followsStargateRules : tweak.followsStargateRules(config);
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

  updateUrlImpl(s, v, sg).then(r => {});
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');
async function updateUrlImpl(s: SelectedTweaksMap, v: string, sg: boolean): Promise<void> {
  const json = JSON.stringify(s);
  const brotli = await brotliPromise;
  const compressedBrotli = bytesToBase64(brotli.compress(textEncoder.encode(json), { quality: 11 }));
  // const compressed = LZString.compressToEncodedURIComponent(json);
  // console.log(compressedBrotli.length, compressed.length);

  const params = new URLSearchParams();
  params.set('v', v);
  if (sg) params.set('sg', '1');
  params.set('q', compressedBrotli);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  await tick();
  replaceState(newUrl, {});
}

export async function loadFromUrl() {
  if (!browser) return;
  const params = new URLSearchParams(window.location.search);

  const v = params.get('v');
  if (v) selectedVersion.set(v);

  const sg = params.get('sg');
  if (sg) stargateFilter.set(true);

  const q = params.get('q');
  if (q) {
    const brotli = await brotliPromise;
    try {
      const json = textDecoder.decode(brotli.decompress(base64ToBytes(q)));
      // const json = LZString.decompressFromEncodedURIComponent(q);
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
    alert('Failed to generate download: ' + String(e).split('\n', 2)[0]);
  } finally {
    // Hide the modal after a short tick to let UI show 100% momentarily
    setTimeout(() => zipProgress.set(undefined), 1000);
  }
}
