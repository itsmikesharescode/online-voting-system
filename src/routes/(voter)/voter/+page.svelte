<script lang="ts">
  import { routeState } from '$lib/runes/Route.svelte.js';
  import ResultCard from '$lib/components/struct/voter/result/result-card.svelte';

  const { data } = $props();
  const route = routeState();
  route.setRoute('/voter');
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
  <div class="grid gap-[5px] lg:grid-cols-2">
    {#if data.results.data?.length}
      {#each data.results.data as result}
        <ResultCard {result} />
      {/each}
    {:else}
      <p>No live results atm.</p>
    {/if}
  </div>
</div>
