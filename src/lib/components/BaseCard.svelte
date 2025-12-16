<script lang="ts">
	export let icon: string;
	export let name: string;
	export let description: string = '';
	export let sgState: boolean | undefined = undefined;
	export let as: 'div' | 'button' = 'div';
	export let statusClass: string = '';
	export let selected: boolean = false;
	export let hasConfigs: boolean = false;

	$: sgStateDisplay = sgState === true
		? 'Yes'
		: sgState === false
			? 'No'
			: 'Depends';
</script>

<svelte:element
	this={as}
	class={`card ${statusClass} ${selected ? 'selected' : ''}`}
	{...$$restProps}
	on:click
>
	<div class="header">
		<span class="icon">{icon}</span>
		<h3>
			{name}
			{#if hasConfigs}
				<span class="cfg-icon" title="Has configuration">⚙️</span>
			{/if}
		</h3>
		<span class="sg-badge" data-status={sgStateDisplay}>SG: {sgStateDisplay}</span>
		<slot name="header-actions" />
	</div>

	{#if description}
		<p class="desc">{description}</p>
	{/if}

	<slot />

	<slot name="footer" />
</svelte:element>

<style lang="scss">
    @use '$lib/styles/mixins' as mixins;
	.card {
		@include mixins.card-pane();
		@include mixins.card-accent(var(--border));
		@include mixins.interactive-surface;
		@include mixins.card-selectable();

		&.error {
			@include mixins.card-accent(var(--error));
			background: color-mix(in srgb, var(--error) 8%, var(--surface));
		}
		&.warning {
			@include mixins.card-accent(var(--warning));
		}
		&.ok {
			@include mixins.card-accent(var(--success));
		}

		.header {
			@include mixins.card-header;

			h3 {
				margin: 0;
				flex-grow: 1;
			}
			.icon { font-size: 1.5rem; }

			.sg-badge {
				@include mixins.badge();

				&[data-status='Yes'] {
					color: var(--success);
				}
				&[data-status='No'] {
					color: var(--error);
				}
				&[data-status='Depends'] {
					color: var(--warning);
				}
			}
		}

		.desc {
			font-size: 0.9rem;
			@include mixins.muted-text;
			margin-bottom: 1rem;
		}
	}

	.cfg-icon {
		margin-left: 0.4rem;
		font-size: 1.1rem;
	}
</style>
