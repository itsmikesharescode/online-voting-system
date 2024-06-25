<script lang="ts">
	import { routeState } from '$lib/runes.svelte';
	import DetailsCard from '$lib/components/struct/admin/root/details-card.svelte';
	import { UserCheck, NotebookText } from 'lucide-svelte';
	import BarChart from '$lib/components/struct/admin/root/bar-chart.svelte';
	import LineChart from '$lib/components/struct/admin/root/line-chart.svelte';

	const { data } = $props();

	routeState.setActiveRoute('/admin');
</script>

{#snippet userCheck()}
	<UserCheck />
{/snippet}

{#snippet noteBookText()}
	<NotebookText />
{/snippet}

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
	<div class="grid sm:grid-cols-2">
		<div class="flex h-[50dvh] items-center">
			<BarChart
				totalVoter={data.totalVoter.count}
				totalVoted={data.totalVoted.count}
				totalPositions={data.totalVoted.count}
				totalCandidates={data.totalCandidates.count}
			/>
		</div>

		<div class="flex h-[50dvh] items-center">
			<LineChart
				totalVoter={data.totalVoter.count}
				totalVoted={data.totalVoted.count}
				totalPositions={data.totalVoted.count}
				totalCandidates={data.totalCandidates.count}
			/>
		</div>
	</div>

	<div class="mt-[20px] grid gap-[10px] md:grid-cols-2 lg:grid-cols-4">
		<DetailsCard title="Total Voter" icon={userCheck} value={data.totalVoter.count ?? 0} />
		<DetailsCard title="Total Voted" icon={userCheck} value={data.totalVoted.count ?? 0} />
		<DetailsCard
			title="Total Positions"
			icon={noteBookText}
			value={data.totalPositions.count ?? 0}
		/>
		<DetailsCard
			title="Total Candidates"
			icon={noteBookText}
			value={data.totalCandidates.count ?? 0}
		/>
	</div>
</div>
