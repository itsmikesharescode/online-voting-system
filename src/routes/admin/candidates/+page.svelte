<script lang="ts">
	import CreateCandidate from '$lib/components/struct/admin/candidates/create-candidate.svelte';
	import RenderCandidates from '$lib/components/struct/admin/candidates/render-candidates.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import { fromCandidatesRouteState } from '$lib/runes/CandidatesRoute.svelte.js';
	import { fromPositionsRouteState } from '$lib/runes/PositionsRoute.svelte.js';
	import { userState } from '$lib/runes/userState.svelte.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	const user = userState();
	const candidatesRoute = fromCandidatesRouteState();
	const positions = fromPositionsRouteState();

	onMount(() => {
		routeState.setActiveRoute('/admin/candidates');
	});
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<CreateCandidate
		createCandidateForm={data.createCandidateForm}
		positions={positions.getPositionsArray()}
		user={user.getUser()}
	/>

	<div class="mt-[20px]">
		<RenderCandidates
			candidates={candidatesRoute.getCandidateArray()}
			user={user.getUser()}
			positions={positions.getPositionsArray()}
			updateCandidateForm={data.updateCandidateForm}
		/>
	</div>
</div>
