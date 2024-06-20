<script lang="ts">
	import { page } from '$app/stores';
	import ForgotPassword from '$lib/components/struct/static/forgot-password.svelte';
	import Login from '$lib/components/struct/static/login.svelte';
	import Register from '$lib/components/struct/static/register.svelte';

	const { data } = $props();
</script>

<div class="grid md:grid-cols-2">
	<div class="hidden border-r-[1px] md:block">
		<div class="mx-auto mt-[20dvh] md:px-[2rem] lg:px-[5rem]">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Online Voting System
			</h1>
			<p class="mt-[10px] leading-7 text-muted-foreground">
				Take charge of your voting process with our easy-to-use platform. Create and manage your own
				voting events with complete control over every detail.
			</p>
		</div>
	</div>

	<div class="flex min-h-screen flex-col justify-center p-[1rem]">
		{#if $page.url.searchParams.get('q') === 'register'}
			<Register registerForm={data.registerForm} />
		{:else if $page.url.searchParams.get('q') === 'forgot-password'}
			<ForgotPassword forgotPwdForm={data.forgotPwdForm} />
		{:else}
			<Login loginForm={data.loginForm} />
		{/if}

		<div class="mx-auto mt-[10dvh] w-[300px] sm:w-[350px]">
			<p class="text-center leading-7 text-muted-foreground">
				By clicking continue, you agree to our <b class="underline">Terms of Service</b> and
				<b class="underline">Privacy Policy</b> .
			</p>
		</div>
	</div>
</div>
