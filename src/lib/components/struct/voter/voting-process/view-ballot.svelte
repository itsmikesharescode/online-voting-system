<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { voterState } from '$lib/runes.svelte';
	import type { Candidate } from '$lib/types';
	import * as Card from '$lib/components/ui/card';

	type BallotType = {
		position_name: string;
		candidate_list_tb: Candidate[];
	};

	let open = $state(false);

	function transformCandidates(candidates: Candidate[]) {
		const positionMap: { [key: string]: BallotType } = {};

		candidates.forEach((candidate) => {
			const position_id = candidate.position_id;
			const position_name = candidate.position_json.position_name;

			if (!positionMap[position_id]) {
				positionMap[position_id] = {
					position_name,
					candidate_list_tb: []
				};
			}

			positionMap[position_id].candidate_list_tb.push(candidate);
		});

		return Object.values(positionMap);
	}
</script>

<Button onclick={() => (open = true)}>View Button</Button>

<AlertDialog.Root bind:open>
	<AlertDialog.Content class="w-full md:max-w-[80dvw]">
		<AlertDialog.Header>
			<AlertDialog.Title>Voting Ballot Penoy</AlertDialog.Title>
			<AlertDialog.Description>Voting ballot penoy hopya mani popcorn</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="grid h-[50dvh] gap-[10px] overflow-auto p-[1rem] lg:max-h-[70dvh] lg:grid-cols-3">
			{#each transformCandidates(voterState.getVotes()) as position}
				<Card.Root>
					<Card.Header>
						<Card.Title>{position.position_name}</Card.Title>
					</Card.Header>
					<Card.Content>
						{#each position.candidate_list_tb as candidate}
							<p>{candidate.display_name}</p>
						{/each}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button onclick={() => alert('Comming soon im lazy this is just a side troll project')}
				>Submit Vote</Button
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
