<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Footer from '$lib/components/general/footer.svelte';

	import Spinner from '$lib/components/general/spinner.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { initUser, userState } from '$lib/runes/userState.svelte';
	import { initRoute } from '$lib/runes/Route.svelte';

	const { children, data: clientData } = $props();

	initUser();
	initRoute();
	const user = userState();
	user.setUser(clientData.user);

	onMount(() => {
		const {
			data: { subscription }
		} = clientData.supabase.auth.onAuthStateChange(async (event, _session) => {
			if (_session?.expires_at !== clientData.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<Spinner />
<Toaster richColors={true} />
{@render children()}
<Footer />
