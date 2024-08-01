<script lang="ts">
	import ResultCard from '$lib/components/struct/admin/result/result-card.svelte';
	import { fromCandidatesRouteState } from '$lib/runes/CandidatesRoute.svelte';
	import { fromLiveResultRouteState } from '$lib/runes/LiveResultRoute.svelte';
	import { routeState } from '$lib/runes/Route.svelte';

	const route = routeState();
	route.setRoute('/admin/result');

	const results = fromLiveResultRouteState().getLiveResultArray();
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<div class="grid gap-[5px] lg:grid-cols-2">
		{#if results?.length}
			{#each results ?? [] as result}
				<ResultCard {result} />
			{/each}
		{:else}
			<p>No live results atm.</p>
		{/if}
	</div>
</div>
