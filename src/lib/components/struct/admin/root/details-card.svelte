<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	interface PropType {
		title: string;
		icon: Snippet;
		value: number;
	}

	const { title, icon, value }: PropType = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center justify-between">
			{title}
			{@render icon()}
		</Card.Title>
	</Card.Header>
	<Card.Content class="grid gap-[20px]">
		<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">30</h1>

		<Card.Description>+10 Today</Card.Description>
	</Card.Content>
</Card.Root>
