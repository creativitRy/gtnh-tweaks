<script lang="ts">
  import type { TweakDef } from '$lib/tweak';
  import { selections, validationState, stargateFilter, updateConfig, toggleTweak } from '$lib/stores/appState';
  import BaseCard from '$lib/components/BaseCard.svelte';

  export let tweak: TweakDef;

  $: config = $selections[tweak.id];
  $: errors = $validationState[tweak.id] || [];
  $: sgState = typeof tweak.stargateState === 'boolean' ? tweak.stargateState : tweak.stargateState(config);

  $: statusClass = errors.length > 0 ? 'error' : !sgState && !$stargateFilter ? 'warning' : 'ok';
</script>

<BaseCard
  icon={tweak.icon}
  name={tweak.name}
  description={tweak.description}
  {sgState}
  {statusClass}
  hasConfigs={!!tweak.configs}
>
  <button
    slot="header-actions"
    class="clear-btn"
    title="Deselect this tweak"
    aria-label="Deselect"
    on:click|stopPropagation={() => toggleTweak(tweak.id)}
  >
    ×
  </button>
  {#if tweak.configs}
    <div class="controls">
      {#each Object.entries(tweak.configs) as [key, schema] (key)}
        {#key `${tweak.id}-${key}`}
          <div class="control-group">
            <label for={`${tweak.id}-${key}`}>{schema.label}</label>

            {#if schema.type === 'checkbox'}
              <input
                id={`${tweak.id}-${key}`}
                type="checkbox"
                checked={Boolean(config[key])}
                on:change={e => updateConfig(tweak.id, key, e.currentTarget.checked)}
              />
            {:else if schema.type === 'slider'}
              <div class="slider-row">
                <input
                  id={`${tweak.id}-${key}`}
                  type="range"
                  min={schema.min}
                  max={schema.max}
                  value={Number(config[key])}
                  on:input={e => updateConfig(tweak.id, key, +e.currentTarget.value)}
                />
                <span>{Number(config[key])}</span>
              </div>
            {:else if schema.type === 'select'}
              <select
                id={`${tweak.id}-${key}`}
                value={String(config[key])}
                on:change={e => updateConfig(tweak.id, key, e.currentTarget.value)}
              >
                {#each schema.options || [] as opt (opt)}
                  <option value={opt}>{opt}</option>
                {/each}
              </select>
            {/if}
          </div>
        {/key}
      {/each}
    </div>
  {/if}

  <svelte:fragment slot="footer">
    {#if errors.length > 0}
      <div class="errors">
        {#each errors as err (err)}
          <div class="err-msg">⚠️ {err}</div>
        {/each}
      </div>
    {/if}
  </svelte:fragment>
</BaseCard>

<style lang="scss">
  @use '$lib/styles/mixins' as mixins;

  .controls {
    background: var(--surface-2);
    padding: 0.5rem;
    border-radius: var(--radius-sm);

    .control-group {
      @include mixins.form-row(0.5rem);

      &:last-child {
        margin-bottom: 0;
      }

      .slider-row {
        @include mixins.inline-cluster(0.5rem);
      }
    }
  }

  .errors {
    margin-top: 1rem;

    .err-msg {
      @include mixins.error-text;
    }
  }

  .clear-btn {
    margin-left: 0.5rem;
    align-self: center;
    border: 0;
    background: transparent;
    color: var(--muted-fg);
    font-size: 1rem;
    line-height: 1;
    padding: 0.15rem 0.35rem;
    border-radius: var(--radius-sm);
    cursor: pointer;

    &:hover {
      background: var(--surface-3);
      color: var(--fg);
    }
  }
</style>
