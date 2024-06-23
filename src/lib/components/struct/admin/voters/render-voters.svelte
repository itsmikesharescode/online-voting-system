<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Ellipsis, UserRound } from 'lucide-svelte';
	import EditVoter from './operations/edit-voter.svelte';
	import DeleteVoter from './operations/delete-voter.svelte';
	import type { Voters } from '$lib/types';
	import type { User } from '@supabase/supabase-js';

	interface Props {
		voters: Voters[] | null;
		user: User | null;
	}

	const { voters, user }: Props = $props();
</script>

{#if voters?.length && user}
	<div class="grid gap-[10px]">
		<div
			class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] backdrop-blur-lg md:grid-cols-[42.5%,42.5%,5%] lg:sticky lg:grid-cols-[37.5%,37.5%,15%,10%]"
		>
			<p class="">Voter Name</p>
			<p class="hidden md:block">Email</p>
			<p class="hidden lg:block">Created At</p>
		</div>

		{#each voters as voterInfo}
			<div
				class=" grid grid-cols-[90%,8%] items-center gap-[2%] p-[10px] md:grid-cols-[41%,41%,5%] lg:grid-cols-[37.5%,37.5%,15%,8%]"
			>
				<div class="flex items-center gap-[5px]">
					<UserRound class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]" />
					<p class="">{voterInfo.display_name}</p>
				</div>
				<p class="hidden md:block">{voterInfo.email}</p>
				<p class="hidden lg:block">{new Date(voterInfo.created_at).toLocaleDateString()}</p>

				<div class="w-fit">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button aria-haspopup="true" size="icon" variant="ghost" builders={[builder]}>
								<Ellipsis class="h-4 w-4" />
								<span class="sr-only">Toggle menu</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Label>Actions</DropdownMenu.Label>

							<div class="grid gap-[5px] p-[10px]">
								<EditVoter {voterInfo} {user} />
								<DeleteVoter />
							</div>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		{/each}
	</div>
{:else}
	no voters
{/if}
