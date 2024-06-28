<script lang="ts">
	import { enhance } from '$app/forms';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ResultModel } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { adminState } from '$lib/runes.svelte';

	interface Props {
		openDelete: boolean;
	}

	let { openDelete = $bindable() }: Props = $props();

	let deleteLoader = $state(false);
	const deletePositon: SubmitFunction = () => {
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
					openDelete = false;
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

<AlertDialog.Root bind:open={openDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the position {adminState.getSelectedPosition()
					?.position_name}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleteLoader} onclick={() => (openDelete = false)}>
				Cancel
			</AlertDialog.Cancel>

			<form method="post" action="?/deletePositon" use:enhance={deletePositon}>
				<input name="positionId" type="hidden" value={adminState.getSelectedPosition()?.id} />
				<Button disabled={deleteLoader} type="submit" class="w-full">
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
