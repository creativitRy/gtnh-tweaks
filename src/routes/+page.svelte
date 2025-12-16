<script lang="ts">
	import { onMount } from 'svelte';
	import {
		selectedVersion,
		tweaksByGroup,
		selections,
		toggleTweak,
		loadFromUrl,
		stargateFilter,
		validationState,
		updateUrl
	} from '$lib/stores/appState';
	import { browser } from '$app/environment';
	import { GTNH_VERSIONS } from '$lib/data/versions';
	import TweakCard from '$lib/components/TweakCard.svelte';
	import ConfigCard from '$lib/components/ConfigCard.svelte';
	import { TWEAKS } from '$lib/data/tweaks';
    import type { TweakDef } from '$lib/types';

	onMount(() => {
		loadFromUrl();
	});

 let openGroups: Record<string, boolean> = {};
  let openConfigGroups: Record<string, boolean> = {};

	function toggleGroup(g: string) {
		openGroups[g] = !openGroups[g];
	}

 $: selectedTweakList = Object.keys($selections)
    	.map((id) => TWEAKS.find((t) => t.id === id))
    	.filter((t) => !!t)
    	// sort by group name case-insensitively
    	.sort((a, b) => (a?.group || '').toLowerCase().localeCompare((b?.group || '').toLowerCase()));

  // Left panel: groups sorted by group name (case-insensitive)
  $: leftGroupEntries = Object.entries($tweaksByGroup).sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase())
  );

	// Group selected tweaks (right panel) by their group
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

 // Right panel: groups sorted by group name (case-insensitive)
 $: selectedGroupEntries = Object.entries(selectedTweaksByGroup).sort((a, b) =>
   a[0].toLowerCase().localeCompare(b[0].toLowerCase())
 );

 // Validation helpers
 $: hasAnyErrors = Object.values($validationState || {}).some((errs) => (errs?.length || 0) > 0);
 $: tweaksWithErrors = new Set(
     Object.entries($validationState || {})
         .filter(([, errs]) => (errs?.length || 0) > 0)
         .map(([id]) => id)
 );
 function groupHasErrors(groupTweaks: TweakDef[]) {
     return groupTweaks.some((t) => tweaksWithErrors.has(t.id));
 }

	if (browser) {
		void $selectedVersion;
		void $stargateFilter;
		updateUrl();
	}
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
						Stargate Rules Only
					</label>
				</div>

				<div class="preset-select">
					<label for="preset-select">Preset:</label>
					<select id="preset-select">
						<option>Custom</option>
						<option disabled>Coming Soon...</option>
					</select>
				</div>
			</div>
		</div>
	</header>

	<main class="grid">
		<section class="panel left">
			{#each leftGroupEntries as [group, groupTweaks] (group)}
				<div class="accordion">
					<button class="acc-header" on:click={() => toggleGroup(group)}>
						{group}
						<span class="arrow">{openGroups[group] ? '▼' : '▶'}</span>
					</button>

					{#if openGroups[group]}
						<div class="acc-body">
							{#each [...groupTweaks].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) as tweak (tweak.id)}
								{#if !$stargateFilter || tweak.stargateState !== false}
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
							<button class="acc-header {groupHasErrors(groupTweaks) ? 'error' : ''}" on:click={() => (openConfigGroups[group] = !openConfigGroups[group])}>
								{#if groupHasErrors(groupTweaks)}
									<span class="err-ico" aria-hidden="true">⚠️</span>
								{/if}
								<span class="label">{group}</span>
								<span class="arrow">{openConfigGroups[group] ? '▼' : '▶'}</span>
							</button>

							{#if openConfigGroups[group]}
								<div class="acc-body">
									{#each [...groupTweaks].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) as tweak (tweak.id)}
										<ConfigCard {tweak} />
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>

			<footer>
				<button class="btn-primary" disabled={Object.keys($selections).length === 0 || hasAnyErrors}>
					Download Tweaks.zip
				</button>
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
			.arrow { margin-left: auto; }

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
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 1rem;

		.err-ico {
			margin-right: 0.4rem;
		}

		&.error {
			border-bottom-color: var(--error);
			
			h2 { color: var(--error); }
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
	}

	.empty-state {
		text-align: center;
		color: var(--text-muted);
		margin-top: 3rem;
	}
</style>
