<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Footer from '$lib/components/general/footer.svelte';

	const { children } = $props();
</script>

<Toaster />
{@render children()}
<Footer />
