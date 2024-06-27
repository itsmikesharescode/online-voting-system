<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { voterState } from '$lib/runes.svelte';
	import type { ResultModel } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { toast } from 'svelte-sonner';
	import type { User } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	import { transformCandidates } from '$lib/helpers';
	import { LoaderCircle } from 'lucide-svelte';

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();

	user?.user_metadata.displayName;

	let open = $state(false);

	let submitLoader = $state(false);
	const insertVote: SubmitFunction = () => {
		submitLoader = true;
		return async ({ result, update }) => {
			const {
				status,
				data: { msg }
			} = result as ResultModel<{ msg: string }>;

			switch (status) {
				case 200:
					toast.success('', { description: msg });
					voterState.resetVote();
					goto('/voter', { invalidateAll: true });
					break;

				case 401:
					toast.error('', { description: msg });
					submitLoader = false;
					break;
			}
			await update();
		};
	};

	console.log(user);
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
			<AlertDialog.Cancel disabled={submitLoader}>Cancel</AlertDialog.Cancel>
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
					<Button disabled={submitLoader} type="submit" class="w-full">
						{#if submitLoader}
							<LoaderCircle class="animate-spin" />
						{:else}
							Submit Vote
						{/if}
					</Button>
				</form>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
