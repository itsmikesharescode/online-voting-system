<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Footer from '$lib/components/general/footer.svelte';

	import Spinner from '$lib/components/general/spinner.svelte';

	const { children, data: clientData } = $props();
</script>

<Spinner />
<Toaster />
{@render children()}
<Footer />
