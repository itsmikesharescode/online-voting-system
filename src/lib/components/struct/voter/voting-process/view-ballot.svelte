<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { voterState } from '$lib/runes.svelte';
	import type { Candidate, ResultModel } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { toast } from 'svelte-sonner';
	import type { User } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();

	user?.user_metadata.displayName;

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

	const insertVote: SubmitFunction = () => {
		return async ({ result, update }) => {
			const {
				status,
				data: { msg }
			} = result as ResultModel<{ msg: string }>;

			switch (status) {
				case 200:
					toast.success('', { description: msg });
					goto('/voter', { invalidateAll: true });
					break;

				case 401:
					toast.error('', { description: msg });
					break;
			}
			await update();
		};
	};
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
			{#if user}
				<form method="post" action="?/insertVote" use:enhance={insertVote}>
					<input
						name="serialVotes"
						hidden
						value={JSON.stringify({
							displayName: user.user_metadata.displayName,
							voterId: user.id,
							adminId: user.user_metadata.adminId,
							votes: voterState.getVotes()
						})}
					/>
					<Button type="submit">Submit Vote</Button>
				</form>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
