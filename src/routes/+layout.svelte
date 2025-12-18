<script lang="ts">
  import '../app.scss';

  let { children } = $props();
</script>

<svelte:head>
  <title>GTNH Tweaks</title>
  <link rel="icon" href="https://www.gtnewhorizons.com/favicon.svg" />
</svelte:head>

{@render children()}
