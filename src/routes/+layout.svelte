<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.scss';

	let { children } = $props();
</script>

<svelte:head>
	<title>GTNH Tweaks</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
