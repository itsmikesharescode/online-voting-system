<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { createVoterSchema, type CreateVoterSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { LoaderCircle, X } from 'lucide-svelte';

	interface PropType {
		createVoterForm: SuperValidated<Infer<CreateVoterSchema>>;
	}

	const { createVoterForm }: PropType = $props();

	let open = $state(true);

	const form = superForm(createVoterForm, {
		validators: zodClient(createVoterSchema),
		invalidateAll: false
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

<Button onclick={() => (open = true)}>Create Voter</Button>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<button
			onclick={() => (open = false)}
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X />
		</button>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Voter Account</AlertDialog.Title>
			<AlertDialog.Description>
				Account that is been created can login directly at same login page.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/login" use:enhance class="grid gap-[10px]">
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

			<div class="flex justify-end">
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
