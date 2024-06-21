<script lang="ts">
	import Nav from '$lib/components/general/nav.svelte';

	const { data, children } = $props();
</script>

<Nav user={data.user} {children} />
