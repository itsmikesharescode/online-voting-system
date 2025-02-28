<script lang="ts">
	import { forgotPwdSchema, type ForgotPwdSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { ResultModel } from '$lib/types';

	interface PropType {
		forgotPwdForm: SuperValidated<Infer<ForgotPwdSchema>>;
	}

	const { forgotPwdForm }: PropType = $props();

	const form = superForm(forgotPwdForm, {
		validators: zodClient(forgotPwdSchema),
		id: crypto.randomUUID(),
		invalidateAll: false,
		onUpdate({ result }) {
			const { status, data } = result as ResultModel<{ msg: string }>;

			switch (status) {
				case 200:
					toast.success('Forgot Password', { description: data.msg });
					break;
				case 401:
					toast.error('Forgot Password', { description: data.msg });
					break;
			}
		}
	});

	const { form: formData, enhance, submitting, message } = form;
</script>

<div class="mx-auto grid w-[300px] gap-[20px] sm:w-[350px]">
	<div class="">
		<h3 class="scroll-m-20 text-center text-2xl font-semibold tracking-tight">Forgot Password</h3>
		<p class="text-center text-sm leading-7 text-muted-foreground">
			Enter your email to recover your password
		</p>
	</div>

	<form method="POST" action="?/forgotPwd" use:enhance class="grid gap-[10px]">
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input type="email" {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.Description>Enter your email.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={$submitting}>
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{:else}
				Send Reset Link
			{/if}
		</Form.Button>
	</form>

	<Separator />

	<Button variant="secondary" href="/">Log In Here</Button>
</div>
