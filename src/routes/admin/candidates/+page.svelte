<script lang="ts">
	import CreateCandidate from '$lib/components/struct/admin/candidates/create-candidate.svelte';
	import RenderCandidates from '$lib/components/struct/admin/candidates/render-candidates.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		routeState.setActiveRoute('/admin/candidates');
	});
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<CreateCandidate createCandidateForm={data.createCandidateForm} user={data.user} />

	<div class="mt-[20px]">
		<RenderCandidates />
	</div>
</div>
