<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';
	import { routeState } from '$lib/runes/Route.svelte';
	import { userState } from '$lib/runes/userState.svelte';
	import { initVotingProcessRoute } from '$lib/runes/VotingProcessRoute.svelte.js';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	initVotingProcessRoute();

	const user = userState();

	user.setUser(data.user);

	const route = routeState();

	onMount(() => {
		route.setThemeState(localStorage.getItem('mode-watcher-mode') as 'light' | 'dark');
	});
</script>

{#snippet child()}
	{@render children()}
{/snippet}

<Nav {child} />
