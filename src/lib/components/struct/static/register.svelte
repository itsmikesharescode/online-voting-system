<script lang="ts">
	import { registerSchema, type RegisterSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from 'lucide-svelte';
	import type { ResultModel } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import { userState } from '$lib/runes/userState.svelte';
	import { goto } from '$app/navigation';

	interface PropType {
		registerForm: SuperValidated<Infer<RegisterSchema>>;
	}

	const { registerForm }: PropType = $props();

	const user = userState();

	const form = superForm(registerForm, {
		validators: zodClient(registerSchema),
		id: crypto.randomUUID(),
		invalidateAll: false,
		onUpdate({ result }) {
			const { status, data } = result as ResultModel<{
				msg: string;
				user: User;
			}>;

			switch (status) {
				case 200:
					toast.success('Create Account', { description: data.msg });
					user.setUser(data.user);
					goto('/admin', { invalidateAll: false });
					break;
				case 401:
					toast.error('Create Account', { description: data.msg });
					break;
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<div class="mx-auto grid w-[300px] gap-[20px] sm:w-[350px]">
	<div class="">
		<h3 class="scroll-m-20 text-center text-2xl font-semibold tracking-tight">Register</h3>
		<p class="text-center text-sm leading-7 text-muted-foreground">
			Enter your details to register
		</p>
	</div>

	<form method="POST" action="?/register" use:enhance class="grid gap-[10px]">
		<Form.Field {form} name="displayName">
			<Form.Control let:attrs>
				<Form.Label>Display Name</Form.Label>
				<Input type="text" {...attrs} bind:value={$formData.displayName} />
			</Form.Control>
			<Form.Description>Enter your display name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

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

		<Form.Field {form} name="confirmPassword">
			<Form.Control let:attrs>
				<Form.Label>Confirm Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.confirmPassword} />
			</Form.Control>
			<Form.Description>Confirm your password.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={$submitting}>
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{:else}
				Create Account
			{/if}
		</Form.Button>
	</form>

	<Separator />

	<Button variant="secondary" href="/">Log In Here</Button>
</div>
