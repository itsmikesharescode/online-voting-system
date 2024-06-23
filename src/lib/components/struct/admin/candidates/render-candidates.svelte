<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Ellipsis } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import DeleteCandidate from './operations/delete-candidate.svelte';
	import EditCandidate from './operations/edit-candidate.svelte';
	import ViewCandidate from './operations/view-candidate.svelte';
</script>

<div class="grid gap-[10px]">
	<div
		class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] backdrop-blur-lg md:grid-cols-[61%,21%,5%] lg:sticky lg:grid-cols-[75%,15%,8%]"
	>
		<p class="">Candidate Name</p>
		<p class="hidden md:block">Created At</p>
	</div>

	{#each Array(30) as _}
		<div
			class=" grid grid-cols-[90%,8%] items-center gap-[2%] p-[10px] md:grid-cols-[61%,21%,5%] lg:grid-cols-[75%,15%,8%]"
		>
			<div class="flex items-center gap-[5px]">
				<Avatar.Root>
					<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<p class="">Mike John Eviota</p>
			</div>
			<p class="hidden md:block">Nov 1 2024</p>

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
</div>
