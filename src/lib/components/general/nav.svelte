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
	import { goto } from '$app/navigation';

	interface PropType {
		user: User | null;
		child: Snippet;
	}

	const { user, child }: PropType = $props();

	const adminSelections = [
		{
			title: 'Dashboard',
			url: '/admin'
		},

		{
			title: 'Live Result',
			url: '/admin/live-result'
		},

		{
			title: 'Voters',
			url: '/admin/voters'
		},

		{
			title: 'Positions',
			url: '/admin/positions'
		},

		{
			title: 'Candidates',
			url: '/admin/candidates'
		}
	];
	const userSelections = ['Ballot', 'Live Result'];

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
					goto('/', { invalidateAll: true });
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
	class="sticky top-0 z-10 flex items-center justify-between border-b-[1px] border-slate-700 p-[10px] backdrop-blur-lg md:static md:justify-end lg:px-[2rem]"
>
	<button onclick={() => (showMenu = true)} class="md:hidden"><Menu /></button>

	<div class="flex items-center gap-[10px]">
		<p>{user?.user_metadata.displayName}</p>

		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	</div>
</nav>

<div class="grid md:grid-cols-[300px,1fr]">
	<!--Desktop-->
	<div class="sticky top-0 hidden h-fit flex-col gap-[1rem] p-[1rem] md:flex">
		<Button class="relative my-[20px] flex items-center gap-[5px]">
			<LogOut class="absolute left-0 ml-[10px] w-[15px]" />
			Log out
		</Button>

		{#each adminSelections as selection}
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
			class="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-secondary md:hidden"
		>
			<button onclick={() => (showMenu = false)} class="fixed right-0 top-0 m-[10px] p-[10px]">
				<X />
			</button>

			<div class="grid gap-[10px] p-[10px]">
				{#each adminSelections as selection}
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

			<form method="post" action="?/logout" use:enhance={logout} class="absolute bottom-0 m-[1rem]">
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
