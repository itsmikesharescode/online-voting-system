<script lang="ts">
	import { navigating } from '$app/stores';
	import { LoaderCircle } from 'lucide-svelte';
</script>

{#if $navigating}
	<div
		class="fixed bottom-0 left-0 right-0 top-0 z-30 flex flex-col items-center justify-center bg-[#00000050]"
	>
		<LoaderCircle class="h-[200px] w-[200px] animate-spin" />
		<p>Getting Fresh Data</p>
	</div>
{/if}
