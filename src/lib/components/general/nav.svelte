<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import type { Snippet } from 'svelte';
	import Button from '../ui/button/button.svelte';
	import { LogOut, Menu, X, LoaderCircle } from 'lucide-svelte';
	import { routeState } from '$lib/runes.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { ResultModel } from '$lib/types';
	import { page } from '$app/stores';

	interface PropType {
		user: User | null;
		child: Snippet;
	}

	const { user, child }: PropType = $props();

	routeState.setSelections(user);

	let showMenu = $state(false);

	// logout handler
	let logoutLoader = $state(false);
	const logout: SubmitFunction = () => {
		logoutLoader = true;
		return async ({ result, update }) => {
			const {
				status,
				data: { msg }
			} = result as ResultModel<{ msg: string }>;

			switch (status) {
				case 200:
					toast.success('', { description: msg });
					logoutLoader = false;
					break;

				case 401:
					toast.error('', { description: msg });
					logoutLoader = false;

					break;
			}
			await update();
		};
	};
</script>

<nav
	class="sticky top-0 z-20 flex items-center border-b-[1px] border-slate-700
	{$page.url.pathname === '/voting-process'
		? 'justify-between px-[10px] '
		: 'p-[10px] md:justify-end '} 
	backdrop-blur-lg md:static lg:px-[2rem]"
>
	{#if $page.url.pathname !== '/voting-process'}
		<button onclick={() => (showMenu = true)} class="md:hidden"><Menu /></button>

		<div class="flex items-center gap-[10px]">
			<p>{user?.user_metadata.displayName}</p>

			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
		</div>
	{:else}
		<div class="flex items-center gap-[10px]">
			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<p>{user?.user_metadata.displayName}</p>
		</div>

		<form method="post" action="?/logout" use:enhance={logout} class="">
			<Button
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
		</form>
	{/if}
</nav>
{#if $page.url.pathname !== '/voting-process'}
	<div class="grid md:grid-cols-[300px,1fr]">
		<!--Desktop-->
		<div class="sticky top-0 hidden h-fit flex-col gap-[1rem] p-[1rem] md:flex">
			<form method="post" action="?/logout" class="w-full" use:enhance={logout}>
				<Button
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
			</form>
			{#each routeState.getSelections() as selection}
				<a
					href={selection.url}
					class="rounded-r-full p-[1rem] hover:font-semibold
			{routeState.getActiveRoute() === selection.url ? 'bg-secondary font-semibold' : ''} "
					onclick={() => routeState.setActiveRoute(selection.url)}
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
					{#each routeState.getSelections() as selection}
						<a
							href={selection.url}
							class=" p-[10px]
					{routeState.getActiveRoute() === selection.url ? 'border-b-[1px] border-red-500 font-semibold' : ''}
				"
							onclick={() => {
								routeState.setActiveRoute(selection.url);
								showMenu = false;
							}}
						>
							{selection.title}
						</a>
					{/each}
				</div>

				<form
					method="post"
					action="?/logout"
					use:enhance={logout}
					class="absolute bottom-0 m-[1rem]"
				>
					<Button
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
				</form>
			</div>
		{/if}

		{@render child()}
	</div>
{/if}

{@render child()}
