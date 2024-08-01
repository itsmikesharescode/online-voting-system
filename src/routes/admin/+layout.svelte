<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import {
		fromCandidatesRouteState,
		initCandidatesRoute
	} from '$lib/runes/CandidatesRoute.svelte.js';
	import { fromLiveRouteState, initLiveRoute } from '$lib/runes/LiveResultsRoute.svelte.js';
	import { fromPositionsRoute, initPositionsRoute } from '$lib/runes/PositionsRoute.svelte.js';
	import { fromVotersRouteState, initVotersRoute } from '$lib/runes/VotersRoute.svelte.js';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	initLiveRoute();
	initVotersRoute();
	initPositionsRoute();
	initCandidatesRoute();

	const liveRoute = fromLiveRouteState();
	const votersRoute = fromVotersRouteState();
	const positionsRoute = fromPositionsRoute();
	const candidatesRoute = fromCandidatesRouteState();

	liveRoute.setLiveResult(data.adminLoad.data?.candidates);
	votersRoute.setVotersArray(data.adminLoad.data?.voters);
	positionsRoute.setPositionsArray(data.adminLoad.data?.positions);
	candidatesRoute.setCandidateArray(data.adminLoad.data?.candidates);

	onMount(() => {
		routeState.setThemeState(localStorage.getItem('mode-watcher-mode') as 'light' | 'dark');
	});
</script>

{#snippet child()}
	{@render children()}
{/snippet}

<Nav user={data.user} {child} />
