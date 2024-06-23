<script lang="ts">
	import CreatePosition from '$lib/components/struct/admin/positions/create-position.svelte';
	import RenderPositions from '$lib/components/struct/admin/positions/render-positions.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		routeState.setActiveRoute('/admin/positions');
	});
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<CreatePosition createPositionForm={data.createPositionForm} user={data.user} />

	<div class="mt-[20px]">
		<RenderPositions />
	</div>
</div>
