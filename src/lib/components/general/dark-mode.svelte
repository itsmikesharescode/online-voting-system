<script lang="ts">
  import { SunMoon, MoonStar } from 'lucide-svelte';
  import { toggleMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button/index.js';
  import { routeState } from '$lib/runes/Route.svelte';

  const route = routeState();

  function handleClick() {
    toggleMode();

    route.setThemeState(localStorage.getItem('mode-watcher-mode') as 'light' | 'dark');
  }
</script>

<Button on:click={handleClick} variant="outline" size="icon">
  <SunMoon
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <MoonStar
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
