<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';
	import LineChart from '$lib/components/struct/admin/root/line-chart.svelte';

	const { data, children } = $props();
</script>

{#snippet child()}
	{@render children()}
{/snippet}

<Nav user={data.user} {child} />
