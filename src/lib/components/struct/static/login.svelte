<script lang="ts">
	import { loginSchema, type LoginSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from 'lucide-svelte';

	interface PropType {
		loginForm: SuperValidated<Infer<LoginSchema>>;
	}

	const { loginForm }: PropType = $props();

	const form = superForm(loginForm, { validators: zodClient(loginSchema) });

	const { form: formData, enhance, submitting, message } = form;

	$effect(() => {
		if ($message) {
			const { msg, status } = $message as { msg: string; status: number };

			switch (status) {
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

<div class="mx-auto grid w-[300px] gap-[20px] sm:w-[350px]">
	<div class="">
		<h3 class="scroll-m-20 text-center text-2xl font-semibold tracking-tight">Log in</h3>
		<p class="text-center text-sm leading-7 text-muted-foreground">
			Enter your email and password to log in
		</p>
	</div>

	<form method="POST" action="?/login" use:enhance class="grid gap-[10px]">
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input type="email" {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.Description>Enter your email.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.password} />
			</Form.Control>
			<Form.Description>Enter your password.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={$submitting}>
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{:else}
				Log In
			{/if}
		</Form.Button>
	</form>

	<Separator />

	<Button variant="secondary" href="/?q=forgot-password">Forgot Password</Button>
	<Button variant="secondary" href="/?q=register">Create Account</Button>
</div>
