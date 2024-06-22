<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Ellipsis } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<div class="grid gap-[10px]">
	<div
		class="top-0 z-10 grid grid-cols-[90%,8%] gap-[2%] border-b-[1px] border-slate-700 p-[10px] backdrop-blur-lg md:grid-cols-[42.5%,42.5%,5%] lg:sticky lg:grid-cols-[37.5%,37.5%,15%,10%]"
	>
		<p class="">Voter Name</p>
		<p class="hidden md:block">Email</p>
		<p class="hidden lg:block">Created At</p>
	</div>

	{#each Array(30) as _}
		<div
			class=" grid grid-cols-[90%,8%] items-center gap-[2%] p-[10px] md:grid-cols-[41%,41%,5%] lg:grid-cols-[37.5%,37.5%,15%,8%]"
		>
			<div class="flex items-center gap-[5px]">
				<Avatar.Root>
					<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<p class="">Mike John Eviota asdasd sdsd</p>
			</div>
			<p class="hidden md:block">mike@gmail.com</p>
			<p class="hidden lg:block">Nov 1 2024</p>

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
						<DropdownMenu.Item>Edit</DropdownMenu.Item>
						<DropdownMenu.Item>Delete</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	{/each}
</div>
