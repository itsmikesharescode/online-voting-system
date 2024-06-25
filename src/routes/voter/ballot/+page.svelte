<script lang="ts">
	import { routeState } from '$lib/runes.svelte';
	import * as Card from '$lib/components/ui/card';
	import { transformCandidates } from '$lib/helpers';
	import Button from '$lib/components/ui/button/button.svelte';
	import CandidateDetails from '$lib/components/struct/voter/ballot/candidate-details.svelte';
	routeState.setActiveRoute('/voter/ballot');

	const { data } = $props();

	$effect(() => console.log(data.votedRef));
</script>

{#if data.votedRef.data}
	<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
		<div class="grid gap-[20px]">
			<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
				You have voted the following.
			</h3>
			<p class="leading-7 text-muted-foreground">
				Date Voted: {new Date(data.votedRef.data.created_at)}
			</p>

			<div class="grid gap-[10px] md:grid-cols-2">
				{#each transformCandidates(data.votedRef.data.voted_json) as position}
					<Card.Root>
						<Card.Header>
							<Card.Title>{position.position_name}</Card.Title>
						</Card.Header>
						<Card.Content class="grid max-h-[50dvh] gap-[10px] overflow-auto p-[2rem]">
							{#each position.candidate_list_tb as candidate}
								<CandidateDetails {candidate} />
							{/each}
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>
	</div>
{:else}
	you are not authorize
{/if}
