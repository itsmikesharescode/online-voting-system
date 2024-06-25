<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Candidate } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		candidate: Candidate;
	}

	const { candidate }: Props = $props();

	let open = $state(false);
</script>

<Button variant="link" class="justify-start" onclick={() => (open = true)}
	>{candidate.display_name}</Button
>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				>Information for <b class="border-b-[1px] border-slate-700">{candidate.display_name}</b
				></AlertDialog.Title
			>
		</AlertDialog.Header>

		<div class="grid gap-[10px]">
			<span>Running for</span>
			<p class="rounded-lg border-[1px] border-slate-700 p-[10px] text-muted-foreground">
				{candidate.position_json.position_name}
			</p>
		</div>

		<div class="grid gap-[10px]">
			<span>Motto</span>
			<p class="rounded-lg border-[1px] border-slate-700 p-[10px] text-muted-foreground">
				{candidate.motto}
			</p>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
