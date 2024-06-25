<script lang="ts">
	import ViewBallot from '$lib/components/struct/voter/voting-process/view-ballot.svelte';
	import VotingCard from '$lib/components/struct/voter/voting-process/voting-card.svelte';
	import { voterState } from '$lib/runes.svelte';

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

	{#if voterState.getVotes().length}
		<div class="fixed bottom-0 left-0 m-[2rem]">
			<ViewBallot user={data.user} />
		</div>
	{/if}
</div>
