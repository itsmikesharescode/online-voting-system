<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { Plugin } from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';

	import { routeState } from '$lib/runes.svelte';

	let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
	let chartInstance: Chart<'line', { x: number; y: number }[], unknown> | null = $state(null);

	// Convert string dates to timestamps
	function convertToTimestamp(c: { x: string; y: number }[]) {
		return c.map((item) => ({
			x: new Date(item.x).getTime(),
			y: item.y
		}));
	}

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

	const chartValues2: { x: string; y: number }[] = [
		{ x: '2023-01-01', y: 30 },
		{ x: '2023-01-02', y: 50 },
		{ x: '2023-01-03', y: 80 },
		{ x: '2023-01-04', y: 35 },
		{ x: '2023-01-05', y: 10 },
		{ x: '2023-01-06', y: 50 },
		{ x: '2023-01-07', y: 5 }
	];

	const chartValues3: { x: string; y: number }[] = [
		{ x: '2023-01-01', y: 20 },
		{ x: '2023-01-02', y: 80 },
		{ x: '2023-01-03', y: 10 },
		{ x: '2023-01-04', y: 35 },
		{ x: '2023-01-05', y: 10 },
		{ x: '2023-01-06', y: 3 },
		{ x: '2023-01-07', y: 5 }
	];

	const chartValues4: { x: string; y: number }[] = [
		{ x: '2023-01-01', y: 10 },
		{ x: '2023-01-02', y: 8 },
		{ x: '2023-01-03', y: 5 },
		{ x: '2023-01-04', y: 5 },
		{ x: '2023-01-05', y: 30 },
		{ x: '2023-01-06', y: 3 },
		{ x: '2023-01-07', y: 9 }
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

		const allTimestamps = [
			...convertToTimestamp(chartValues),
			...convertToTimestamp(chartValues2),
			...convertToTimestamp(chartValues3),
			...convertToTimestamp(chartValues4)
		].map((item) => item.x);

		const minTimestamp = Math.min(...allTimestamps);
		const maxTimestamp = Math.max(...allTimestamps);

		const hoverLinePlugin: Plugin<'line'> = {
			id: 'hoverLinePlugin',

			beforeDatasetsDraw: (chart) => {
				const activeTooltip = chart.tooltip;
				if (activeTooltip && activeTooltip.getActiveElements().length) {
					const activePoint = activeTooltip.getActiveElements()[0];
					const ctx = chart.ctx;
					const x = activePoint.element.x;
					const topY = chart.scales.y.top;
					const bottomY = chart.scales.y.bottom;

					// Draw the vertical line
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, topY);
					ctx.lineTo(x, bottomY);
					ctx.lineWidth = 1;
					ctx.strokeStyle = getColor();
					ctx.stroke();
					ctx.restore();
				}
			}
		};

		const tooltipPlugin = {
			id: 'tooltipPlugin ',
			tooltip: {
				yAlign: 'bottom'
			}
		};

		chartInstance = new Chart<'line', { x: number; y: number }[], unknown>(ctx, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Total Voter',
						borderColor: getColor(),
						data: convertToTimestamp(chartValues),
						tension: 0.4,
						pointBackgroundColor: '',
						pointRadius: 5
					},

					{
						label: 'Total Candidates',
						borderColor: getColor(),
						data: convertToTimestamp(chartValues2),
						tension: 0.4,
						pointBackgroundColor: '',
						pointRadius: 5
					},

					{
						label: 'Total Candidates',
						borderColor: getColor(),
						data: convertToTimestamp(chartValues3),
						tension: 0.4,
						pointBackgroundColor: '',
						pointRadius: 5
					},

					{
						label: 'Total Candidates',
						borderColor: getColor(),
						data: convertToTimestamp(chartValues4),
						tension: 0.4,
						pointBackgroundColor: '',
						pointRadius: 5
					}
				]
			},
			plugins: [tooltipPlugin, hoverLinePlugin],
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time',
						min: minTimestamp, // Start the axis at the first data point
						max: maxTimestamp, // End at the last data point
						time: {
							unit: 'day',
							tooltipFormat: 'PP',
							displayFormats: {
								day: 'MMM d'
							}
						},
						offset: true,
						ticks: {
							source: 'data' // Only show ticks at data points
						}
					},

					y: {
						offset: true
					}
				},

				plugins: {
					title: {
						display: true
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						position: 'nearest',
						yAlign: 'bottom',
						titleMarginBottom: 0,
						cornerRadius: 15,
						padding: 10,
						titleFont: {
							size: 16
						},

						// external: externalTooltipHandler
						callbacks: {
							title: function (context) {
								let nearest = context[0];

								// add padding
								return ` ${nearest.label} `;
							}
						},
						backgroundColor: ''
					},
					legend: {
						display: true
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
			chartInstance.data.datasets[1].borderColor = getColor();
			chartInstance.data.datasets[2].borderColor = getColor();
			chartInstance.data.datasets[3].borderColor = getColor();
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
