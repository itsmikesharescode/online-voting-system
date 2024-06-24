<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Ellipsis, FlagTriangleRight, Cat } from 'lucide-svelte';
	import DeletePosition from './operations/delete-position.svelte';
	import type { Position } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import { adminState } from '$lib/runes.svelte';

	interface Props {
		positions: Position[] | null;
		user: User | null;
	}

	const { positions, user }: Props = $props();

	let openDelete = $state(false);
</script>

<div class="grid gap-[10px]">
	{#if positions?.length && user}
		<div
			class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] font-semibold backdrop-blur-lg md:sticky md:grid-cols-[61%,21%,5%] lg:grid-cols-[37.5%,37.5%,15%,10%]"
		>
			<p class="">Position Name</p>
			<p class="hidden text-center md:block">Max Vote</p>
			<p class="hidden lg:block">Created At</p>
		</div>

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
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => {
									adminState.setSelectedPosition(positionInfo);
									openDelete = true;
								}}
							>
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>

			<DeletePosition bind:openDelete />
		{/each}
	{:else}
		<div class="mt-[10dvh] p-[20px]">
			<Cat class="mx-auto h-[150px] w-[150px] text-muted-foreground" />
			<p class="text-center text-muted-foreground">There is no positions. Create now!</p>
		</div>
	{/if}
</div>
