<script lang="ts">
	import { page } from '$app/stores';
	import ForgotPassword from '$lib/components/struct/static/forgot-password.svelte';
	import Login from '$lib/components/struct/static/login.svelte';
	import Register from '$lib/components/struct/static/register.svelte';

	const { data } = $props();
</script>

<div class="flex min-h-screen flex-col justify-center p-[1rem]">
	{#if $page.url.searchParams.get('q') === 'register'}
		<Register />
	{:else if $page.url.searchParams.get('q') === 'forgot-password'}
		<ForgotPassword />
	{:else}
		<Login loginForm={data.loginForm} />
	{/if}
</div>
