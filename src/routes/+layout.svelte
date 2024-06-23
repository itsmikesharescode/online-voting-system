<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Footer from '$lib/components/general/footer.svelte';
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';

	const { children, data: clientData } = $props();

	onMount(() => {
		const { supabase, session } = clientData;

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster />
{@render children()}
<Footer />
