<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Voters } from '$lib/types';
	import type { User } from '@supabase/supabase-js';

	interface Prop {
		voterInfo: Voters;
		user: User;
	}

	const { voterInfo, user }: Prop = $props();

	let open = $state(false);
</script>

<Button variant="secondary" class="flex w-full justify-start" onclick={() => (open = true)}>
	Edit
</Button>
<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Edit {voterInfo.display_name} Information</AlertDialog.Title>
			<AlertDialog.Description></AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
