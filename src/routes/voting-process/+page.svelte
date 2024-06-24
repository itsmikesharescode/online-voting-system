<script lang="ts">
	import VotingCard from '$lib/components/struct/voter/voting-process/voting-card.svelte';
	const { data } = $props();
</script>

<div class="grid min-h-screen border-slate-700 p-[2rem]">
	<div class="grid gap-[20px] lg:grid-cols-2">
		{#if data.results.data?.length}
			{#each data.results.data as result}
				<VotingCard {result} />
			{/each}
		{:else}
			<p>No live results atm.</p>
		{/if}
	</div>
</div>
