<script lang="ts">
	import { onMount } from 'svelte';
	import {
		download,
		loadFromUrl,
		selectedVersion,
		selections,
		stargateFilter,
		toggleTweak,
		tweaksByGroup,
		updateUrl,
		validationState,
		zipProgress
	} from '$lib/stores/appState';
	import { browser } from '$app/environment';
	import { GTNH_VERSIONS } from '$lib/data/versions';
	import TweakCard from '$lib/components/TweakCard.svelte';
	import ConfigCard from '$lib/components/ConfigCard.svelte';
	import { ALL_TWEAKS } from '$lib/data/tweaks';
	import type { ModToDownload, TweakDef } from '$lib/tweak';
	import Icon from '@iconify/svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	onMount(() => {
		loadFromUrl();
	});

	let openGroups: Record<string, boolean> = {};
	let openConfigGroups: Record<string, boolean> = {};

	function toggleGroup(g: string) {
		openGroups[g] = !openGroups[g];
	}

	$: selectedTweakList = Object.keys($selections)
		.map(id => ALL_TWEAKS.get(id))
		.filter(t => !!t)
		.sort((a, b) => (a?.group || '').toLowerCase().localeCompare((b?.group || '').toLowerCase()));

	$: leftGroupEntries = Object.entries($tweaksByGroup).sort((a, b) =>
		a[0].toLowerCase().localeCompare(b[0].toLowerCase())
	);

	$: selectedTweaksByGroup = selectedTweakList.reduce(
		(acc, t) => {
			const tweak = t as TweakDef;
			const g = tweak.group || 'Other';
			if (!acc[g]) acc[g] = [];
			acc[g].push(tweak);
			// Ensure config groups are expanded by default
			if (openConfigGroups[g] === undefined) openConfigGroups[g] = true;
			return acc;
		},
		{} as Record<string, TweakDef[]>
	);

	$: selectedGroupEntries = Object.entries(selectedTweaksByGroup).sort((a, b) =>
		a[0].toLowerCase().localeCompare(b[0].toLowerCase())
	);

	$: hasAnyErrors = Object.values($validationState || {}).some(errs => (errs?.length || 0) > 0);
	$: tweaksWithErrors = new Set(
		Object.entries($validationState || {})
			.filter(([, errs]) => (errs?.length || 0) > 0)
			.map(([id]) => id)
	);

	function groupHasErrors(groupTweaks: TweakDef[]) {
		return groupTweaks.some(t => tweaksWithErrors.has(t.id));
	}

	$: filesToDownload = selectedTweakList.reduce((acc, t) => {
		const tweak = t as TweakDef;
		const config = $selections[tweak.id];
		for (let mod of tweak.filesToDownload ? tweak.filesToDownload($selectedVersion, config) : []) {
			acc.push(mod);
		}
		return acc;
	}, [] as ModToDownload[]).sort((a, b) => a.filename.localeCompare(b.filename, undefined, {
		numeric: true,
		sensitivity: 'base'
	}));
	$: filesToDelete = [...selectedTweakList.reduce((acc, t) => {
		const tweak = t as TweakDef;
		const config = $selections[tweak.id];
		for (let file of tweak.filesToDelete ? tweak.filesToDelete($selectedVersion, config) : []) {
			acc.add(file);
		}
		return acc;
	}, new Set<string>()).values()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

	onMount(() => {
		if (browser) {
			void $selectedVersion;
			void $stargateFilter;
			updateUrl();
			selectedVersion.subscribe(() => updateUrl());
			stargateFilter.subscribe(() => updateUrl());
		}
	});
</script>

<div class="app-container">
	<header>
		<div class="container header-inner">
			<h1>GTNH Tweaks</h1>
			<div class="controls">
				<div class="ver-select">
					<label for="version-select">Version:</label>
					<select id="version-select" bind:value={$selectedVersion}>
						{#each GTNH_VERSIONS as v (v.id)}
							<option value={v.id}>{v.id} ({v.date})</option>
						{/each}
					</select>
				</div>

				<div class="filter-check">
					<label>
						<input type="checkbox" bind:checked={$stargateFilter} />
						Stargate
						<a href="https://gtnh.miraheze.org/wiki/Stargate#Discord_Role_Requirements" target="_blank">Ru</a><a
						href="https://docs.google.com/document/d/1Iww1FNLkCuun6s6LW7Q6_1Z1aldtxYeRxYOeq_P-vK8/edit?tab=t.0"
						target="_blank">les</a
					> (SG) Only
					</label>
				</div>

				<div class="preset-select">
					<label for="preset-select">Preset:</label>
					<select id="preset-select">
						<option>Custom</option>
						<option disabled>Coming Soon...</option>
					</select>
				</div>

				<div class="help-links">
					<a
						class="icon-button"
						href={data.props.repository}
						target="_blank"
						rel="noreferrer"
						aria-label="Open gtnh-tweaks on GitHub"
						title="gtnh-tweaks on GitHub"
					>
						<Icon icon="mdi:github" width="25" height="25" />
					</a>
				</div>
			</div>
		</div>
	</header>

	<main class="grid">
		<section class="panel left">
			<div class="sticky-header">
				<h2>All Tweaks</h2>
			</div>
			{#each leftGroupEntries as [group, groupTweaks] (group)}
				<div class="accordion">
					<button class="acc-header" on:click={() => toggleGroup(group)}>
						{group}
						<span class="arrow">{openGroups[group] ? '▼' : '▶'}</span>
					</button>

					{#if openGroups[group]}
						<div class="acc-body">
							{#each [...groupTweaks].sort((a, b) => a.name
								.toLowerCase()
								.localeCompare(b.name.toLowerCase())) as tweak (tweak.id)}
								{#if !$stargateFilter || tweak.followsStargateRules !== false}
									<TweakCard {tweak} on:click={() => toggleTweak(tweak.id)} />
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</section>

		<section class="panel right">
			<div class="sticky-header {hasAnyErrors ? 'error' : ''}">
				<h2>
					{#if hasAnyErrors}
						<span class="err-ico" aria-hidden="true">⚠️</span>
					{/if}
					Your Selection ({Object.keys($selections).length})
				</h2>
			</div>

			<div class="config-list">
				{#if selectedTweakList.length === 0}
					<div class="empty-state">Select tweaks from the left menu.</div>
				{:else}
					{#each selectedGroupEntries as [group, groupTweaks] (group)}
						<div class="accordion">
							<button
								class="acc-header {groupHasErrors(groupTweaks) ? 'error' : ''}"
								on:click={() => (openConfigGroups[group] = !openConfigGroups[group])}
							>
								{#if groupHasErrors(groupTweaks)}
									<span class="err-ico" aria-hidden="true">⚠️</span>
								{/if}
								<span class="label">{group}</span>
								<span class="arrow">{openConfigGroups[group] ? '▼' : '▶'}</span>
							</button>

							{#if openConfigGroups[group]}
								<div class="acc-body">
									{#each [...groupTweaks].sort((a, b) => a.name
										.toLowerCase()
										.localeCompare(b.name.toLowerCase())) as tweak (tweak.id)}
										<ConfigCard {tweak} />
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>

			<footer>
				{#if $zipProgress !== undefined}
					<div class="modal-backdrop" aria-hidden={$zipProgress === undefined}>
						<div class="modal" role="dialog" aria-modal="true" aria-label="Generating zip">
							<div class="modal-title">Generating Tweaks.zip</div>
							<div class="progress">
								<div class="bar" style={`width: ${Math.round(($zipProgress || 0) * 100)}%`}></div>
							</div>
							<div class="progress-text">{Math.round(($zipProgress || 0) * 100)}%</div>
							<div class="modal-note">Almost there...</div>
						</div>
					</div>
				{/if}
				<button
					class="btn-primary"
					disabled={Object.keys($selections).length === 0 || hasAnyErrors || $zipProgress !== undefined}
					on:click={() => download($selectedVersion, $selections)}
				>
					Download Tweaks.zip
				</button>
				<div class="download-notes">
					Installation Instructions:
					<br />
					<br />1. Download the generated gtnh-tweaks.zip file.
					<br />2. Unzip the zip file such that the .minecraft folder is overwritten (there should be a gtnh-changes.txt
					file
					next to GregTech_de_DE.lang file)
					{#if filesToDownload.length > 0}
						<br />2.5. Download the following files:
						{#each filesToDownload as file (file.filename)}
							<br />- <a href={file.url} target="_blank">{file.filename}</a> ({file.description})
						{/each}
					{/if}
					{#if filesToDelete.length > 0}
						<br />2.75. Delete the following files:
						{#each filesToDelete as file (file)}
							<br />- {file}
						{/each}
					{/if}
				</div>
			</footer>
		</section>
	</main>
</div>

<style lang="scss">
  @use '$lib/styles/mixins' as mixins;

  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    padding-block: 1rem;
    padding-inline: 0;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);

    h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .controls {
      display: flex;
      gap: 2rem;
      align-items: center;

      label {
        margin-right: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-muted);
      }
    }
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex: 1;
    overflow: hidden;
    // Reuse the layout container width rule from app.scss
    width: min(var(--max-screen-width), 100% - 2rem);
    margin-inline: auto;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: grid;
    place-items: center;
    z-index: 1000;
    /* prevent closing or interacting with background */
    pointer-events: all;
  }

  .modal {
    background: var(--surface-2);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1.25rem 1.25rem 1rem;
    width: min(420px, 92vw);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  }

  .modal-title {
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .progress {
    height: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress .bar {
    height: 100%;
    background: var(--primary);
    width: 0;
    transition: width 120ms ease-out;
  }

  .progress-text {
    text-align: right;
    font-variant-numeric: tabular-nums;
    margin-top: 0.5rem;
    color: var(--text-muted);
  }

  .modal-note {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .panel {
    overflow-y: auto;
    padding: 1rem;

    &.left {
      border-right: 1px solid var(--border);
    }

    &.right {
      background: var(--surface);
      display: flex;
      flex-direction: column;
    }
  }

  .accordion {
    margin-bottom: 0.5rem;

    .acc-header {
      @include mixins.button-base;
      width: 100%;
      justify-content: flex-start;
      text-align: left;
      font-weight: bold;

      // Keep arrow pinned to the far right regardless of leading icons
      .arrow {
        margin-left: auto;
      }

      &.error {
        border-color: var(--error);
        color: var(--error);
        background: color-mix(in srgb, var(--error) 12%, var(--surface-3));
      }
    }

    .acc-body {
      padding: 0.5rem 0;
    }
  }

  .sticky-header {
    border-bottom: 1px solid var(--border);
    margin-bottom: 1rem;

    .err-ico {
      margin-right: 0.4rem;
    }

    &.error {
      border-bottom-color: var(--error);

      h2 {
        color: var(--error);
      }
    }
  }

  .config-list {
    flex: 1;
  }

  .panel.right footer {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    background: var(--surface-2);
    border-top: 1px solid var(--border);
    padding: 1rem;

    .download-notes {
      margin-top: 1rem;
			line-height: 1.5;
      //white-space: pre-line;
    }
  }

  .empty-state {
    text-align: center;
    color: var(--text-muted);
    margin-top: 3rem;
  }
</style>
