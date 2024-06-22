<script lang="ts">
	import CreateVoter from '$lib/components/struct/admin/voters/create-voter.svelte';
	import RenderVoters from '$lib/components/struct/admin/voters/render-voters.svelte';
	import { routeState } from '$lib/runes.svelte.js';
	import { onMount } from 'svelte';

	const { data } = $props();
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<CreateVoter createVoterForm={data.createVoterForm} user={data.user} />

	<div class="mt-[20px]">
		<RenderVoters />
	</div>
</div>
