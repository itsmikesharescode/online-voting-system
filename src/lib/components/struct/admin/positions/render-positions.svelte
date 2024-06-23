<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Ellipsis, FlagTriangleRight } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import DeletePosition from './operations/delete-position.svelte';
	import EditPosition from './operations/edit-position.svelte';
	import type { Positions } from '$lib/types';
	import type { User } from '@supabase/supabase-js';

	interface Props {
		positions: Positions[] | null;
		user: User | null;
	}

	const { positions, user }: Props = $props();
</script>

<div class="grid gap-[10px]">
	<div
		class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] backdrop-blur-lg md:sticky md:grid-cols-[61%,21%,5%] lg:grid-cols-[37.5%,37.5%,15%,10%]"
	>
		<p class="">Position Name</p>
		<p class="hidden text-center md:block">Max Vote</p>
		<p class="hidden lg:block">Created At</p>
	</div>

	{#if positions?.length && user}
		{#each positions as positionInfo}
			<div
				class=" grid grid-cols-[90%,8%] items-center gap-[2%] p-[10px] md:grid-cols-[61%,21%,5%] lg:grid-cols-[37.5%,37.5%,15%,8%]"
			>
				<div class="flex items-center gap-[5px]">
					<FlagTriangleRight
						class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]"
					/>
					<p class="">{positionInfo.position_name}</p>
				</div>

				<p class="hidden text-center md:block">{positionInfo.max_vote}</p>
				<p class="hidden lg:block">{new Date(positionInfo.created_at).toLocaleDateString()}</p>

				<div class="w-fit">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button aria-haspopup="true" size="icon" variant="ghost" builders={[builder]}>
								<Ellipsis class="h-4 w-4" />
								<span class="sr-only">Toggle menu</span>
							</Button>
						</DropdownMenu.Trigger>

						<DropdownMenu.Content align="start">
							<DropdownMenu.Label>Actions</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item class="cursor-pointer">Edit</DropdownMenu.Item>
							<DropdownMenu.Item class="cursor-pointer">Delete</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		{/each}
	{:else}
		<div class="mt-[10dvh] p-[20px]">
			<p class="text-center text-muted-foreground">There is no positions. Create now!</p>
		</div>
	{/if}
</div>
