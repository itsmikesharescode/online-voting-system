<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Candidate, LiveResult } from '$lib/types';
	import BarChart from './bar-chart.svelte';
	import { UserRound } from 'lucide-svelte';
	import { voterState } from '$lib/runes.svelte';

	interface Props {
		result: LiveResult;
	}

	const { result }: Props = $props();

	function canInsert(candidate: Candidate): boolean {
		const positionVotes = voterState.getVotesByPosition(candidate.position_id);
		return positionVotes < result.max_vote;
	}

	function vote(candidate: Candidate) {
		if (canInsert(candidate)) {
			voterState.setVotes(candidate);
		}
	}

	function checkIfExist(b: Candidate) {
		return voterState.getVotes().includes(b);
	}
</script>

<div class="flex h-fit flex-col gap-[10px] rounded-lg border-[1px] border-slate-700 p-[1rem]">
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		{result.position_name}
	</h4>

	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		Max Vote: {result.max_vote}
	</h4>

	{#if result.candidate_list_tb.length}
		<div class="flex flex-col gap-[10px]">
			<div class="grid grid-cols-[70%,30%]">
				<span>
					<p class="font-semibold">Name</p>
				</span>
			</div>

			<div class="flex h-[40dvh] flex-col gap-[10px] overflow-auto p-2">
				{#each result.candidate_list_tb as candidate}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-[5px]">
							<UserRound class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]" />
							<p class="font-semibold">{candidate.display_name}</p>
						</div>

						<div class="">
							{#if checkIfExist(candidate)}
								<Button
									size="sm"
									onclick={() => {
										voterState.removeVote(candidate);
										console.log(voterState.getVotes());
									}}>Unvote</Button
								>
							{:else if !canInsert(candidate)}
								<Button disabled={true} size="sm">Vote</Button>
							{:else}
								<Button size="sm" onclick={() => vote(candidate)}>Vote</Button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex h-[40dvh] items-center justify-center">
			<p class="leading-7 text-muted-foreground">No candidate atm</p>
		</div>
	{/if}
</div>
