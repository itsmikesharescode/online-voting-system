<script lang="ts">
	import { routeState } from '$lib/runes.svelte';
	import DetailsCard from '$lib/components/struct/admin/root/details-card.svelte';
	import { UserCheck, NotebookText } from 'lucide-svelte';

	routeState.setActiveRoute('/admin');
</script>

{#snippet userCheck()}
	<UserCheck />
{/snippet}

{#snippet noteBookText()}
	<NotebookText />
{/snippet}

<div class="min-h-screen p-[1rem] md:border-l-[1px]">
	<div class="grid gap-[10px] md:grid-cols-2 lg:grid-cols-4">
		<DetailsCard title="Total Voter" icon={userCheck} value={30} />
		<DetailsCard title="Total Voted" icon={userCheck} value={30} />
		<DetailsCard title="Total Positions" icon={noteBookText} value={30} />
		<DetailsCard title="Total Candidates" icon={noteBookText} value={30} />
	</div>
</div>
