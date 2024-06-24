<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	onMount(() => {
		routeState.setThemeState(localStorage.getItem('mode-watcher-mode') as 'light' | 'dark');
	});
</script>

{#snippet child()}
	{@render children()}
{/snippet}

<Nav user={data.user} {child} />
