<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Cat, Ellipsis, UserRound } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import DeleteCandidate from './operations/delete-candidate.svelte';
	import EditCandidate from './operations/edit-candidate.svelte';
	import ViewCandidate from './operations/view-candidate.svelte';
	import type { Candidate } from '$lib/types';
	import type { User } from '@supabase/supabase-js';

	interface Props {
		candidates: Candidate[] | null;
		user: User | null;
	}

	const { candidates, user }: Props = $props();
</script>

<div class="grid gap-[10px]">
	<div
		class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] backdrop-blur-lg md:sticky md:grid-cols-[61%,21%,5%] lg:grid-cols-[75%,15%,8%]"
	>
		<p class="">Candidate Name</p>
		<p class="hidden md:block">Created At</p>
	</div>

	{#if candidates?.length && user}
		{#each candidates as candidateInfo}
			<div
				class=" grid grid-cols-[90%,8%] items-center gap-[2%] p-[10px] md:grid-cols-[61%,21%,5%] lg:grid-cols-[75%,15%,8%]"
			>
				<div class="flex items-center gap-[5px]">
					<UserRound class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]" />
					<p class="">{candidateInfo.display_name}</p>
				</div>
				<p class="hidden md:block">{new Date(candidateInfo.created_at).toLocaleDateString()}</p>

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
								<ViewCandidate />
								<EditCandidate />
								<DeleteCandidate />
							</div>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		{/each}
	{:else}
		<div class="mt-[10dvh] p-[20px]">
			<Cat class="mx-auto h-[150px] w-[150px] text-muted-foreground" />
			<p class="text-center text-muted-foreground">There is no positions. Create now!</p>
		</div>
	{/if}
</div>
