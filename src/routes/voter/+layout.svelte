<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';

	const { data, children } = $props();
</script>

{#snippet child()}
	{@render children()}
{/snippet}

<Nav {child} user={data.user} />
