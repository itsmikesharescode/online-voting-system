<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { updateVoterSchema, type UpdateVoterSchema } from '$lib/schema';
	import type { User } from '@supabase/supabase-js';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { LoaderCircle, X } from 'lucide-svelte';
	import { adminState } from '$lib/runes.svelte';

	interface Prop {
		user: User;
		updateVoterForm: SuperValidated<Infer<UpdateVoterSchema>>;
		openEdit: boolean;
	}

	let { user, updateVoterForm, openEdit = $bindable() }: Prop = $props();

	const form = superForm(updateVoterForm, {
		validators: zodClient(updateVoterSchema)
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
					openEdit = false;
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

<AlertDialog.Root bind:open={openEdit}>
	<AlertDialog.Content>
		<button
			onclick={() => (openEdit = false)}
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X />
		</button>

		<AlertDialog.Header>
			<AlertDialog.Title
				>Edit {adminState.getSelectedVoter()?.display_name} Information</AlertDialog.Title
			>
			<AlertDialog.Description></AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/updateVoter" use:enhance class="grid gap-[10px]">
			<div class="h-[70dvh] overflow-auto p-[10px] sm:h-fit">
				<Form.Field {form} name="voterId">
					<Form.Control let:attrs>
						<Input
							tabindex={1}
							type="hidden"
							{...attrs}
							value={adminState.getSelectedVoter()?.voter_id}
						/>
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="adminId">
					<Form.Control let:attrs>
						<Input tabindex={1} type="hidden" {...attrs} value={user?.id} />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="displayName">
					<Form.Control let:attrs>
						<Form.Label>Display Name</Form.Label>
						<Input type="text" {...attrs} bind:value={$formData.displayName} />
					</Form.Control>
					<Form.Description>Enter the display name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input type="email" {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.Description>Enter the email.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input type="password" {...attrs} bind:value={$formData.password} />
					</Form.Control>
					<Form.Description>Enter the password.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="confirmPassword">
					<Form.Control let:attrs>
						<Form.Label>Confirm Password</Form.Label>
						<Input type="password" {...attrs} bind:value={$formData.confirmPassword} />
					</Form.Control>
					<Form.Description>Confirm the password.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex justify-end px-[10px]">
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircle class="animate-spin" />
					{:else}
						Update Info
					{/if}
				</Form.Button>
			</div>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
