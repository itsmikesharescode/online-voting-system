<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Cat, Ellipsis, UserRound } from 'lucide-svelte';
	import type { Candidate, Position } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import CandidateDetails from './operations/candidate-details.svelte';
	import EditCandidate from './operations/edit-candidate.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { UpdateCandidateSchema } from '$lib/schema';
	import DeleteCandidate from './operations/delete-candidate.svelte';
	import { fromCandidatesRouteState } from '$lib/runes/CandidatesRoute.svelte';

	interface Props {
		candidates: Candidate[] | null;
		user: User | null;
		positions: Position[] | null;
		updateCandidateForm: SuperValidated<Infer<UpdateCandidateSchema>>;
	}

	const { candidates, user, positions, updateCandidateForm }: Props = $props();

	const candidateRoute = fromCandidatesRouteState();

	let openDetails = $state(false);
	let openEdit = $state(false);
	let openDelete = $state(false);
</script>

<div class="grid gap-[10px]">
	{#if candidates?.length && user}
		<div
			class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] font-semibold backdrop-blur-lg md:sticky md:grid-cols-[61%,21%,5%] lg:grid-cols-[55%,25%,10%,8%]"
		>
			<p class="">Candidate Name</p>
			<p class="hidden md:block">Position</p>
			<p class="hidden lg:block">Created</p>
		</div>
		{#each candidates as candidateInfo}
			<div
				class=" grid grid-cols-[90%,8%] items-center gap-[2%] p-[10px] md:grid-cols-[61%,21%,5%] lg:grid-cols-[55%,25%,10%,8%]"
			>
				<div class="flex items-center gap-[5px]">
					<UserRound class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]" />
					<p class="">{candidateInfo.display_name}</p>
				</div>

				<p class="hidden md:block">{candidateInfo.position_json.position_name}</p>
				<p class="hidden lg:block">{new Date(candidateInfo.created_at).toLocaleDateString()}</p>

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
							<DropdownMenu.Separator />
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => {
									candidateRoute.setActiveIndex(candidateInfo);
									openDetails = true;
								}}
							>
								Details
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => {
									candidateRoute.setActiveIndex(candidateInfo);
									openEdit = true;
								}}
							>
								Edit
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => {
									candidateRoute.setActiveIndex(candidateInfo);
									openDelete = true;
								}}
							>
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		{/each}
		<CandidateDetails bind:openDetails />
		<EditCandidate {updateCandidateForm} {positions} bind:openEdit />
		<DeleteCandidate bind:openDelete />
	{:else}
		<div class="mt-[10dvh] p-[20px]">
			<Cat class="mx-auto h-[150px] w-[150px] text-muted-foreground" />
			<p class="text-center text-muted-foreground">There is no positions. Create now!</p>
		</div>
	{/if}
</div>
