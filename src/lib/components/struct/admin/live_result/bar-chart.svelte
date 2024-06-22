<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	import { routeState } from '$lib/runes.svelte';

	let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
	let chartInstance: Chart | null = $state(null);

	const chartValues: number[] = [10, 20, 30, 4, 59, 29, 20, 5, 5, 3, 66, 22, 7];
	const chartLabels: string[] = [
		'Mike',
		'Peter',
		'John',
		'Miks',
		'Ruby',
		'Peter',
		'Kevin',
		'Juls',
		'Joyce',
		'Tigrel',
		'Miya',
		'Lesley'
	];

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
			type: 'bar',

			data: {
				labels: chartLabels,
				datasets: [
					{
						label: 'Senators Graph',
						backgroundColor: getColor(),
						data: chartValues
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,

				scales: {
					x: {
						display: false,
						offset: true
					},
					y: {
						display: false,
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
