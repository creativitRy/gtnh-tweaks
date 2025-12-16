<script lang="ts">
	import { onMount } from 'svelte';
	import {
		selectedVersion,
		tweaksByGroup,
		selections,
		toggleTweak,
		loadFromUrl,
		stargateFilter,
		updateUrl
	} from '$lib/stores/appState';
	import { browser } from '$app/environment';
	import { GTNH_VERSIONS } from '$lib/data/versions';
	import TweakCard from '$lib/components/TweakCard.svelte';
	import ConfigCard from '$lib/components/ConfigCard.svelte';
	import { TWEAKS } from '$lib/data/tweaks';

	onMount(() => {
		loadFromUrl();
	});

	let openGroups: Record<string, boolean> = {};

	function toggleGroup(g: string) {
		openGroups[g] = !openGroups[g];
	}

	$: selectedTweakList = Object.keys($selections)
		.map((id) => TWEAKS.find((t) => t.id === id))
		.filter((t) => !!t)
		.sort((a, b) => (a?.group || '').localeCompare(b?.group || ''));

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
			{#each Object.entries($tweaksByGroup) as [group, groupTweaks] (group)}
				<div class="accordion">
					<button class="acc-header" on:click={() => toggleGroup(group)}>
						{group}
						<span class="arrow">{openGroups[group] ? '▼' : '▶'}</span>
					</button>

					{#if openGroups[group]}
						<div class="acc-body">
							{#each groupTweaks as tweak (tweak.id)}
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
			<div class="sticky-header">
				<h2>Your Selection ({Object.keys($selections).length})</h2>
			</div>

			<div class="config-list">
				{#each selectedTweakList as tweak (tweak.id)}
					<ConfigCard {tweak} />
				{/each}

				{#if selectedTweakList.length === 0}
					<div class="empty-state">Select tweaks from the left menu.</div>
				{/if}
			</div>

			<footer>
				<button class="btn-primary" disabled={Object.keys($selections).length === 0}>
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
			justify-content: space-between;
			text-align: left;
			font-weight: bold;
		}

		.acc-body {
			padding: 0.5rem 0;
		}
	}

	.sticky-header {
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 1rem;
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
