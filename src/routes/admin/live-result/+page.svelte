<script lang="ts">
	import BarChart from '$lib/components/struct/admin/live_result/bar-chart.svelte';
	import ResultCard from '$lib/components/struct/admin/live_result/result-card.svelte';
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<div class="grid gap-[5px] lg:grid-cols-3">
		{#each Array(5) as _}
			<ResultCard />
		{/each}
	</div>
</div>
