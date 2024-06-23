<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { createCandidateSchema, type CreateCandidateSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { LoaderCircle, X } from 'lucide-svelte';
	import type { User } from '@supabase/supabase-js';
	import SelectPosition from './select-position.svelte';

	interface PropType {
		createCandidateForm: SuperValidated<Infer<CreateCandidateSchema>>;
		user: User | null;
	}

	const { createCandidateForm, user }: PropType = $props();

	let open = $state(false);

	const form = superForm(createCandidateForm, {
		validators: zodClient(createCandidateSchema)
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

<Button onclick={() => (open = true)}>Add Candidate</Button>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<button
			onclick={() => (open = false)}
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X />
		</button>
		<AlertDialog.Header>
			<AlertDialog.Title>Add Candidate</AlertDialog.Title>
			<AlertDialog.Description>
				This will add a candidate that voters can vote on.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createVoter" use:enhance class="grid gap-[10px]">
			<div class="h-[70dvh] overflow-auto p-[10px] sm:h-fit">
				<Form.Field {form} name="adminId">
					<Form.Control let:attrs>
						<Input type="hidden" {...attrs} value={user?.id} />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="selectedPosition">
					<Form.Control let:attrs>
						<Form.Label>Positions</Form.Label>
						<SelectPosition />
					</Form.Control>
					<Form.Description>Select the position.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="displayName">
					<Form.Control let:attrs>
						<Form.Label>Display Name</Form.Label>
						<Input type="text" {...attrs} bind:value={$formData.displayName} />
					</Form.Control>
					<Form.Description>Enter the display name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="motto">
					<Form.Control let:attrs>
						<Form.Label>Candidate Motto</Form.Label>
						<Textarea {...attrs} bind:value={$formData.motto} />
					</Form.Control>
					<Form.Description>Enter the motto.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex justify-end px-[10px]">
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircle class="animate-spin" />
					{:else}
						Create Voter
					{/if}
				</Form.Button>
			</div>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
