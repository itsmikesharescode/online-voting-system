<script lang="ts">
	import { routeState } from '$lib/runes/Route.svelte';
	import DetailsCard from '$lib/components/struct/admin/root/details-card.svelte';
	import { UserCheck, NotebookText } from 'lucide-svelte';
	import BarChart from '$lib/components/general/bar-chart.svelte';
	import LineChart from '$lib/components/general/line-chart.svelte';
	import { fromVotersRouteState } from '$lib/runes/VotersRoute.svelte.js';
	import { fromVotedRouteState } from '$lib/runes/VotedRoute.svelte.js';
	import { fromPositionsRouteState } from '$lib/runes/PositionsRoute.svelte.js';
	import { fromCandidatesRouteState } from '$lib/runes/CandidatesRoute.svelte.js';

	const route = routeState();
	route.setRoute('/admin');

	const voterCount = fromVotersRouteState().getVotersArray()?.length;
	const votedVotersCount = fromVotedRouteState().getVotedArray()?.length;
	const positionsCount = fromPositionsRouteState().getPositionsArray()?.length;
	const candidatesCount = fromCandidatesRouteState().getCandidateArray()?.length;
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
				totalVoter={voterCount ?? 0}
				totalVoted={votedVotersCount ?? 0}
				totalPositions={positionsCount ?? 0}
				totalCandidates={candidatesCount ?? 0}
			/>
		</div>

		<div class="flex h-[50dvh] items-center">
			<LineChart
				totalVoter={voterCount ?? 0}
				totalVoted={votedVotersCount ?? 0}
				totalPositions={positionsCount ?? 0}
				totalCandidates={candidatesCount ?? 0}
			/>
		</div>
	</div>

	<div class="mt-[20px] grid gap-[10px] md:grid-cols-2 lg:grid-cols-4">
		<DetailsCard title="Total Voter" icon={userCheck} value={voterCount ?? 0} />
		<DetailsCard title="Total Voted" icon={userCheck} value={votedVotersCount ?? 0} />
		<DetailsCard title="Total Positions" icon={noteBookText} value={positionsCount ?? 0} />
		<DetailsCard title="Total Candidates" icon={noteBookText} value={candidatesCount ?? 0} />
	</div>
</div>
