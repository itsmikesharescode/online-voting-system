<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { routeState } from '$lib/runes.svelte';

	interface Props {
		totalVoter: number | null;
		totalVoted: number | null;
		totalPositions: number | null;
		totalCandidates: number | null;
	}

	const { totalVoter, totalVoted, totalPositions, totalCandidates }: Props = $props();

	let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
	let chartInstance: Chart | null = $state(null);

	const chartValues: number[] = [
		totalVoter ?? 0,
		totalVoted ?? 0,
		totalPositions ?? 0,
		totalCandidates ?? 0
	];
	const chartLabels: string[] = [
		'Total Voter',
		'Total Voted',
		'Total Positions',
		'Total Candidates'
	];

	onMount(async () => {
		if (typeof window !== 'undefined') {
			createChart();
		}
	});

	function createChart() {
		if (!chartCanvas) return;

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		chartInstance = new Chart(ctx, {
			type: 'line', // Changed to 'line'
			data: {
				labels: chartLabels,
				datasets: [
					{
						label: 'Graph Shit',
						backgroundColor: getColor(),
						borderColor: getColor(), // Added borderColor for line chart
						data: chartValues,
						fill: false // Optional: prevents the area under the line from being filled
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						display: true,
						offset: true
					},
					y: {
						display: true,
						offset: true
					}
				},
				plugins: {}
			}
		});
	}

	function getColor() {
		return routeState.getThemeState() === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
	}

	$effect(() => {
		if (chartInstance) {
			chartInstance.data.datasets[0].backgroundColor = getColor();
			chartInstance.data.datasets[0].borderColor = getColor(); // Update borderColor as well
			chartInstance.update();
		}
	});
</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>

<style>
	canvas {
		width: 100% !important;
		height: 100% !important;
	}
</style>
