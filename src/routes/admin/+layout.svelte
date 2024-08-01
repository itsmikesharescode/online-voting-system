<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import {
		fromCandidatesRouteState,
		initCandidatesRoute
	} from '$lib/runes/CandidatesRoute.svelte.js';
	import {
		fromLiveResultRouteState,
		initLiveResultRoute
	} from '$lib/runes/LiveResultRoute.svelte.js';
	import { fromPositionsRouteState, initPositionsRoute } from '$lib/runes/PositionsRoute.svelte.js';
	import { fromVotedRouteState, initVotedRoute } from '$lib/runes/VotedRoute.svelte.js';
	import { fromVotersRouteState, initVotersRoute } from '$lib/runes/VotersRoute.svelte.js';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	initLiveResultRoute();
	initVotersRoute();
	initVotedRoute();
	initPositionsRoute();
	initCandidatesRoute();

	const liveResultRoute = fromLiveResultRouteState();
	const votersRoute = fromVotersRouteState();
	const votedRoute = fromVotedRouteState();
	const positionsRoute = fromPositionsRouteState();
	const candidatesRoute = fromCandidatesRouteState();

	liveResultRoute.setLiveResultArray(data.adminLoad.data?.live_results ?? null);
	votersRoute.setVotersArray(data.adminLoad.data?.voters ?? null);
	votedRoute.setVotedArray(data.adminLoad.data?.voted_voters ?? null);
	positionsRoute.setPositionsArray(data.adminLoad.data?.positions ?? null);
	candidatesRoute.setCandidateArray(data.adminLoad.data?.candidates ?? null);

	onMount(() => {
		routeState.setThemeState(localStorage.getItem('mode-watcher-mode') as 'light' | 'dark');
	});
</script>

{#snippet child()}
	{@render children()}
{/snippet}

<Nav user={data.user} {child} />
