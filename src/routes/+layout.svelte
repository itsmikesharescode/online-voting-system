<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Footer from '$lib/components/general/footer.svelte';
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import Spinner from '$lib/components/general/spinner.svelte';
	import { page } from '$app/stores';

	const { children, data: clientData } = $props();
</script>

<Spinner />
<Toaster />
{@render children()}
<Footer />
