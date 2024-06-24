<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { adminState } from '$lib/runes.svelte';
	import { X } from 'lucide-svelte';

	interface Props {
		openDetails: boolean;
	}

	let { openDetails = $bindable() }: Props = $props();
</script>

<AlertDialog.Root bind:open={openDetails}>
	<AlertDialog.Content>
		<button
			onclick={() => (openDetails = false)}
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X />
		</button>
		<AlertDialog.Header>
			<AlertDialog.Title>Details</AlertDialog.Title>
			<AlertDialog.Description>
				This is the information for {adminState.getSelectedCandidate()?.display_name}.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="flex flex-col gap-[10px]">
			<div class="grid gap-[10px]">
				<span>Display Name</span>
				<p class="rounded-lg border-[1px] border-slate-700 p-[10px] text-muted-foreground">
					{adminState.getSelectedCandidate()?.display_name}
				</p>
			</div>

			<div class="grid gap-[10px]">
				<span>Running for</span>
				<p class="rounded-lg border-[1px] border-slate-700 p-[10px] text-muted-foreground">
					{adminState.getSelectedCandidate()?.position_json.position_name}
				</p>
			</div>

			<div class="flex flex-col gap-[10px]">
				<p>Motto</p>
				<p class="w-full rounded-lg border-[1px] border-slate-700 p-[10px] text-muted-foreground">
					{adminState.getSelectedCandidate()?.motto}
				</p>
			</div>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
