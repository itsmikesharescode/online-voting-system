<script lang="ts">
	import type { LiveResult } from '$lib/types';
	import DynamicBarChart from '$lib/components/general/dynamic-bar-chart.svelte';
	import { UserRound } from 'lucide-svelte';

	interface Props {
		result: LiveResult;
	}

	const { result }: Props = $props();
</script>

<div class="flex flex-col gap-[10px] rounded-lg border-[1px] border-slate-700 p-[1rem]">
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		{result.position_name}
	</h4>

	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		Max Vote: {result.max_vote}
	</h4>

	<div class="h-[20dvh]">
		<DynamicBarChart position={result.position_name} candidates={result.candidate_list_tb} />
	</div>
	{#if result.candidate_list_tb.length}
		<div class="flex flex-col gap-[10px]">
			<div class="grid grid-cols-[70%,30%]">
				<span>
					<p class="font-semibold">Name</p>
				</span>

				<span>
					<p class="mx-auto max-w-fit text-center font-semibold">Count</p>
				</span>
			</div>

			<div class="flex h-[40dvh] flex-col gap-[10px] overflow-auto">
				{#each result.candidate_list_tb as candidate}
					<div class="grid grid-cols-[70%,30%]">
						<div class="flex items-center gap-[5px]">
							<UserRound class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]" />
							<p class="font-semibold">{candidate.display_name}</p>
						</div>

						<span>
							<p class="mx-auto max-w-fit text-center font-semibold">{candidate.vote_count}</p>
						</span>
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
