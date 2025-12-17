<script lang="ts">
  import type { TweakDef } from '$lib/tweak';
  import { selections } from '$lib/stores/appState';
  import BaseCard from '$lib/components/BaseCard.svelte';

  export let tweak: TweakDef;

  $: isSelected = !!$selections[tweak.id];
  $: sgState = tweak.followsStargateRules === true ? true : tweak.followsStargateRules === false ? false : undefined;
</script>

<BaseCard
  as="button"
  type="button"
  selected={isSelected}
  icon={tweak.icon}
  name={tweak.name}
  description={tweak.description}
  {sgState}
  hasConfigs={!!tweak.configs}
  on:click
></BaseCard>
