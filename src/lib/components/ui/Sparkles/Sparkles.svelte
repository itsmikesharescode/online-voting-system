<script lang="ts">
  import { cn } from '$lib/utilss/cn';
  import { Motion } from 'svelte-motion';

  interface PropType {
    minSize: number;
    maxSize: number;
    speed: number;
    particleColor: string;
    particleDensity: number | undefined;
    className: string | undefined;
  }

  const {
    minSize = 0.6,
    maxSize = 1.5,
    speed = 3,
    particleColor = '#ffffff',
    particleDensity = 200,
    className = undefined
  }: PropType = $props();

  let randomMove = () => Math.random() * 4 - 2;

  function getRandomValue() {
    return minSize + Math.random() * (maxSize - minSize);
  }
</script>

<div class={cn('relative h-48', className)}>
  <div class="absolute inset-0">
    {#each [...Array(particleDensity)] as _, i (`star-${i}`)}
      <Motion
        let:motion
        animate={{
          top: `calc(${Math.random() * 100}% + ${randomMove()}px)`,
          left: `calc(${Math.random() * 100}% + ${randomMove()}px)`,
          opacity: Math.random(),
          scale: [1, 1.2, 0]
        }}
        transition={{
          duration: Math.random() * 10 + speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <span
          use:motion
          class="inline-block"
          style={`position: absolute; width: ${getRandomValue()}px; height: ${getRandomValue()}px; background-color: ${particleColor}; border-radius: 50%; top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;`}
        ></span>
      </Motion>
    {/each}
  </div>
</div>
