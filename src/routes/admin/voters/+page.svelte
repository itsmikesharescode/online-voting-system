<script lang="ts">
	import CreateVoter from '$lib/components/struct/admin/voters/create-voter.svelte';

	const { data } = $props();
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<CreateVoter createVoterForm={data.createVoterForm} />
</div>
