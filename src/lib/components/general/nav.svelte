<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import type { Snippet } from 'svelte';
	import Button from '../ui/button/button.svelte';
	import { LogOut } from 'lucide-svelte';

	interface PropType {
		user: User | null;
		children: Snippet;
	}

	const { user, children }: PropType = $props();

	const selections = ['Dashboard', 'Live Result', 'Voters', 'Position', 'Candidates'];
</script>

<nav
	class="sticky top-0 flex justify-end border-b-[1px] p-[10px] backdrop-blur-lg md:static lg:px-[2rem]"
>
	<div class="flex items-center gap-[10px]">
		<p>{user?.user_metadata.displayName}</p>

		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	</div>
</nav>

<div class="grid md:grid-cols-[300px,1fr]">
	<div class="sticky top-0 hidden h-fit flex-col gap-[1rem] p-[1rem] md:flex">
		<Button class="relative my-[20px] flex items-center gap-[5px]">
			<LogOut class="absolute left-0 ml-[10px] w-[15px]" />
			Log out
		</Button>

		{#each selections as selection}
			<a href=" " class="rounded-r-full p-[1rem] hover:bg-secondary">{selection}</a>
		{/each}
	</div>

	{@render children()}
</div>
