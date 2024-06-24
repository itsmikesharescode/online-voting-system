<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { voterState } from '$lib/runes.svelte';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>View Button</Button>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Voting Ballot Penoy</AlertDialog.Title>
			<AlertDialog.Description>Voting ballot penoy hopya mani popcorn</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="">
			{#each voterState.getVotes() as candidate}
				<p>{candidate.display_name}</p>
			{/each}
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
