<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../ui/button/button.svelte';
	import { LogOut, Menu, X, LoaderCircle, CircleUser } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { userState } from '$lib/runes/userState.svelte';
	import { goto } from '$app/navigation';
	import { routeState } from '$lib/runes/Route.svelte';

	interface PropType {
		child: Snippet;
	}

	const { child }: PropType = $props();

	const route = routeState();

	const user = userState();
	route.setSelections(user.getUser());

	let showMenu = $state(false);

	let logoutLoader = $state(false);
	const logoutHandler = async () => {
		logoutLoader = true;
		const res = await fetch('/logout-api', {
			method: 'post',
			headers: {
				'content-typed': 'application/json'
			},
			body: JSON.stringify({
				user: user.getUser()?.id
			})
		});

		const { msg } = await res.json();
		if (res.status === 401) {
			toast.error('Log out', { description: msg });
			logoutLoader = false;
		} else if (res.status === 200) {
			goto('/');
		}
	};
</script>

<nav
	class="sticky top-0 z-20 flex items-center border-b-[1px] border-slate-700
	{$page.url.pathname === '/voting-process'
		? 'justify-between px-[10px] '
		: 'justify-between p-[10px] md:justify-end '} 
	backdrop-blur-lg md:static lg:px-[2rem]"
>
	{#if $page.url.pathname !== '/voting-process'}
		<button onclick={() => (showMenu = true)} class="md:hidden"><Menu /></button>

		<div class="flex items-center gap-[10px]">
			<p>{user.getUser()?.user_metadata.displayName}</p>

			<CircleUser class="h-[30px] w-[30px]" />
		</div>
	{:else}
		<div class="flex items-center gap-[10px]">
			<CircleUser class="h-[30px] w-[30px]" />
			<p>{user.getUser()?.user_metadata.displayName}</p>
		</div>

		<Button
			onclick={logoutHandler}
			disabled={logoutLoader}
			type="submit"
			class="relative my-[20px] flex items-center gap-[5px] sm:w-[150px]"
		>
			{#if logoutLoader}
				<LoaderCircle class="animate-spin" />
			{:else}
				<LogOut class="absolute left-0 ml-[10px] w-[15px]" />
				<p class="hidden sm:block">Log out</p>
			{/if}
		</Button>
	{/if}
</nav>
{#if $page.url.pathname === '/voting-process'}
	{@render child()}
{:else}
	<div class="grid md:grid-cols-[300px,1fr]">
		<!--Desktop-->
		<div class="sticky top-0 hidden h-fit flex-col gap-[1rem] p-[1rem] md:flex">
			<Button
				onclick={logoutHandler}
				disabled={logoutLoader}
				type="submit"
				class="relative my-[20px] flex w-full items-center gap-[5px]"
			>
				{#if logoutLoader}
					<LoaderCircle class="animate-spin" />
				{:else}
					<LogOut class="absolute left-0 ml-[10px] w-[15px]" />
					Log out
				{/if}
			</Button>

			{#each route.getSelections() as selection}
				<a
					href={selection.url}
					class="rounded-r-full p-[1rem] hover:font-semibold
		{route.getRoute() === selection.url ? 'bg-secondary font-semibold' : ''} "
					onclick={() => route.setRoute(selection.url)}
				>
					{selection.title}
				</a>
			{/each}
		</div>

		<!--Mobile-->
		{#if showMenu}
			<div
				class="fixed bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-secondary md:hidden"
			>
				<button onclick={() => (showMenu = false)} class="fixed right-0 top-0 m-[10px] p-[10px]">
					<X />
				</button>

				<div class="grid gap-[10px] p-[10px]">
					{#each route.getSelections() as selection}
						<a
							href={selection.url}
							class="p-[10px]
							{route.getRoute() === selection.url ? 'border-b-[1px] border-red-500 font-semibold' : ''}
							"
							onclick={() => {
								route.setRoute(selection.url);
								showMenu = false;
							}}
						>
							{selection.title}
						</a>
					{/each}
				</div>

				<div class="absolute bottom-0 m-[1rem]">
					<Button
						onclick={logoutHandler}
						disabled={logoutLoader}
						type="submit"
						class="relative my-[20px] flex w-[150px] items-center gap-[5px]"
					>
						{#if logoutLoader}
							<LoaderCircle class="animate-spin" />
						{:else}
							<LogOut class="absolute left-0 ml-[10px] w-[15px]" />
							Log out
						{/if}
					</Button>
				</div>
			</div>
		{/if}

		{@render child()}
	</div>
{/if}
