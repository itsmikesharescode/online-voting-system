<script lang="ts">
	import ResultCard from '$lib/components/struct/admin/result/result-card.svelte';
	import { routeState } from '$lib/runes.svelte.js';

	const { data } = $props();

	routeState.setActiveRoute('/admin/result');
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<div class="grid gap-[5px] lg:grid-cols-2">
		{#if data.results.data?.length}
			{#each data.results.data as result}
				<ResultCard {result} />
			{/each}
		{:else}
			<p>No live results atm.</p>
		{/if}
	</div>
</div>
