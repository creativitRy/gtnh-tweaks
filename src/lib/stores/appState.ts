import { writable, derived, get } from 'svelte/store';
import { TWEAKS } from '$lib/data/tweaks';
import { GTNH_VERSIONS } from '$lib/data/versions';
import type { SelectedTweaksMap, TweakId, TweakDef, TweakConfig, ConfigValue } from '$lib/tweak';
import LZString from 'lz-string';
import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
import { tick } from 'svelte';

export const selectedVersion = writable<string>(GTNH_VERSIONS[0].id);
export const stargateFilter = writable<boolean>(false);
export const selections = writable<SelectedTweaksMap>({});
export const presetName = writable<string>('custom');

export const availableTweaks = derived(selectedVersion, ($ver) => {
	return TWEAKS.filter((t) => t.supportedVersions($ver));
});

export const tweaksByGroup = derived(availableTweaks, ($tweaks) => {
	const groups: Record<string, TweakDef[]> = {};
	$tweaks.sort((a, b) => a.name.localeCompare(b.name));
	$tweaks.forEach((t) => {
		if (!groups[t.group]) groups[t.group] = [];
		groups[t.group].push(t);
	});
	return groups;
});

export const validationState = derived(
	[selections, stargateFilter, selectedVersion],
	([$sel, $sgFilter, $ver]) => {
		const errors: Record<TweakId, string[]> = {};
		const selectedIds = Object.keys($sel);

		selectedIds.forEach((id) => {
			errors[id] = [];
			const tweak = TWEAKS.find((t) => t.id === id);
			if (!tweak) return;

			const config = $sel[id];

			if (!tweak.supportedVersions($ver)) {
				errors[id].push(`Not supported in version ${$ver}`);
			}

			if (tweak.incompatibleWith) {
				tweak.incompatibleWith.forEach((badId) => {
					if ($sel[badId]) {
						const badName = TWEAKS.find((t) => t.id === badId)?.name || badId;
						errors[id].push(`Incompatible with ${badName}`);
					}
				});
			}

			const sgState =
				typeof tweak.stargateState === 'boolean'
					? tweak.stargateState
					: tweak.stargateState(config);
			if ($sgFilter && !sgState) {
				errors[id].push('Violates Stargate Rules (Filter Active)');
			}
		});

		return errors;
	}
);

export function toggleTweak(id: TweakId) {
	selections.update((s) => {
		if (s[id]) {
			const rest = { ...s } as Record<string, TweakConfig>;
			delete rest[id];
			return rest;
		} else {
			const tweak = TWEAKS.find((t) => t.id === id);
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
	selections.update((s) => {
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
			if (json) selections.set(JSON.parse(json));
		} catch (e) {
			console.error('Failed to parse URL state', e);
		}
	}
}
