<script lang="ts">
	import { routeState } from '$lib/runes.svelte';
	import DetailsCard from '$lib/components/struct/admin/root/details-card.svelte';
	import { UserCheck, NotebookText } from 'lucide-svelte';
	import LineChart from '$lib/components/struct/admin/root/line-chart.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		routeState.setThemeState(localStorage.getItem('mode-watcher-mode') as 'light' | 'dark');
		routeState.setActiveRoute('/admin');
	});
</script>

{#snippet userCheck()}
	<UserCheck />
{/snippet}

{#snippet noteBookText()}
	<NotebookText />
{/snippet}

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<div class="">
		<div class="flex h-[50dvh] items-center">
			<LineChart />
		</div>
	</div>

	<div class="mt-[20px] grid gap-[10px] md:grid-cols-2 lg:grid-cols-4">
		<DetailsCard title="Total Voter" icon={userCheck} value={30} />
		<DetailsCard title="Total Voted" icon={userCheck} value={30} />
		<DetailsCard title="Total Positions" icon={noteBookText} value={30} />
		<DetailsCard title="Total Candidates" icon={noteBookText} value={30} />
	</div>
</div>
