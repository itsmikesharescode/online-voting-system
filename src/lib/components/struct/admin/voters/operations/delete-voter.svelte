<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ResultModel, Voters } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		voterInfo: Voters;
	}

	const { voterInfo }: Props = $props();

	let open = $state(false);
	let deleteLoader = $state(false);
	const deleteVoter: SubmitFunction = () => {
		deleteLoader = true;
		return async ({ result, update }) => {
			const {
				status,
				data: { msg }
			} = result as ResultModel<{ msg: string }>;

			switch (status) {
				case 200:
					toast.success('', { description: msg });
					deleteLoader = false;
					open = false;
					break;

				case 401:
					toast.error('', { description: msg });
					deleteLoader = false;
					break;
			}
			await update();
		};
	};
</script>

<Button variant="destructive" class="flex w-full justify-start" onclick={() => (open = true)}>
	Delete
</Button>
<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleteLoader}>Cancel</AlertDialog.Cancel>

			<form method="post" action="?/deleteVoter" use:enhance={deleteVoter}>
				<input name="voterId" type="hidden" value={voterInfo.voter_id} />
				<Button disabled={deleteLoader} type="submit">
					{#if deleteLoader}
						<LoaderCircle class="animate-spin" />
					{:else}
						Yes, delete
					{/if}
				</Button>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
