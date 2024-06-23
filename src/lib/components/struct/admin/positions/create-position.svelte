<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { createPositionSchema, type CreatePositionSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { LoaderCircle, X } from 'lucide-svelte';
	import type { User } from '@supabase/supabase-js';
	import { invalidateAll } from '$app/navigation';

	interface PropType {
		createPositionForm: SuperValidated<Infer<CreatePositionSchema>>;
		user: User | null;
	}

	const { createPositionForm, user }: PropType = $props();

	let open = $state(false);

	const form = superForm(createPositionForm, {
		validators: zodClient(createPositionSchema)
	});

	const { form: formData, enhance, submitting, message } = form;

	$effect(() => {
		if ($message) {
			const { msg, status } = $message as { msg: string; status: number };

			switch (status) {
				case 200:
					toast.success('', {
						description: msg,
						action: {
							label: 'Undo',
							onClick: () => {}
						}
					});
					open = false;
					break;
				case 401:
					toast.error('', {
						description: msg,
						action: {
							label: 'Undo',
							onClick: () => {}
						}
					});
					break;
			}
		}
	});
</script>

<Button onclick={() => (open = true)}>Create Position</Button>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<button
			onclick={() => (open = false)}
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X />
		</button>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Position</AlertDialog.Title>
			<AlertDialog.Description>Created position and deploy candidates.</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createPosition" use:enhance class="grid gap-[10px]">
			<div class="h-[70dvh] overflow-auto p-[10px] sm:h-fit">
				<Form.Field {form} name="adminId">
					<Form.Control let:attrs>
						<Input type="hidden" {...attrs} value={user?.id} />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="positionName">
					<Form.Control let:attrs>
						<Form.Label>Position Name</Form.Label>
						<Input type="text" {...attrs} bind:value={$formData.positionName} />
					</Form.Control>
					<Form.Description>Enter the position name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="maxVote">
					<Form.Control let:attrs>
						<Form.Label>Max Vote</Form.Label>
						<Input type="number" {...attrs} bind:value={$formData.maxVote} />
					</Form.Control>
					<Form.Description>Enter the position name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex justify-end px-[10px]">
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircle class="animate-spin" />
					{:else}
						Create Position
					{/if}
				</Form.Button>
			</div>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
