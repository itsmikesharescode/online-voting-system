<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';

	import { routeState } from '$lib/runes.svelte';

	let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
	let chartInstance: Chart<'line', { x: number; y: number }[], unknown> | null = $state(null);

	// Example data
	const chartValues: { x: string; y: number }[] = [
		{ x: '2023-01-01', y: 20 },
		{ x: '2023-01-02', y: 30 },
		{ x: '2023-01-03', y: 20 },
		{ x: '2023-01-04', y: 15 },
		{ x: '2023-01-05', y: 10 },
		{ x: '2023-01-06', y: 5 },
		{ x: '2023-01-07', y: 0 }
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

		// Convert string dates to timestamps
		const chartData = chartValues.map((item) => ({
			x: new Date(item.x).getTime(),
			y: item.y
		}));

		chartInstance = new Chart<'line', { x: number; y: number }[], unknown>(ctx, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Total Voter',
						borderColor: getColor(),
						data: chartData,
						tension: 0.4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'day',
							tooltipFormat: 'PP',
							displayFormats: {
								day: 'MMM d',
								month: 'MMM yyyy',
								year: 'yyyy'
							}
						}
					},
					y: {
						beginAtZero: true
					}
				},
				plugins: {
					zoom: {
						zoom: {
							wheel: {
								enabled: true
							},
							pinch: {
								enabled: true
							},
							mode: 'x'
						},
						pan: {
							enabled: true,
							mode: 'x'
						}
					}
				}
			}
		});
	}

	function getColor() {
		return routeState.getThemeState() === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
	}

	$effect(() => {
		if (chartInstance) {
			chartInstance.data.datasets[0].borderColor = getColor();
			chartInstance.update();
		}
	});
</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>
