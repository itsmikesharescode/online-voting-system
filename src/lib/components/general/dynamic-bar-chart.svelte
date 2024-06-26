<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	import { routeState } from '$lib/runes.svelte';
	import type { Candidate } from '$lib/types';

	interface Props {
		position: string;
		candidates: Candidate[];
	}

	const { position, candidates }: Props = $props();

	let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
	let chartInstance: Chart | null = $state(null);

	const chartValues: number[] = candidates.map((v) => v.vote_count);
	const chartLabels: string[] = candidates.map((v) => v.display_name);

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const zoomPlugin = await import('chartjs-plugin-zoom');
			Chart.register(zoomPlugin.default);
			createChart();
		}
	});

	function createChart() {
		if (!chartCanvas) return;

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		chartInstance = new Chart(ctx, {
			type: 'line',

			data: {
				labels: chartLabels,
				datasets: [
					{
						label: `${position} Graph`,
						backgroundColor: getColor(),
						data: chartValues,
						borderColor: getColor(),
						fill: false
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					intersect: false,
					mode: 'index'
				},
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
			chartInstance.data.datasets[0].borderColor = getColor();
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
