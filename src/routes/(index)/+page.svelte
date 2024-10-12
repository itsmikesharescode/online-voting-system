<script lang="ts">
  import { page } from '$app/stores';
  import ForgotPassword from '$lib/components/struct/static/forgot-password.svelte';
  import Login from '$lib/components/struct/static/login.svelte';
  import Register from '$lib/components/struct/static/register.svelte';
  import Sparkles from '$lib/components/ui/Sparkles/Sparkles.svelte';

  const { data } = $props();
</script>

<div class="grid md:grid-cols-2">
  <div class="hidden md:block">
    <div class="flex h-[100%] w-full flex-col items-center overflow-hidden rounded-md bg-black">
      <div class="mx-auto mt-[20dvh] md:px-[2rem] lg:px-[5rem]">
        <h1
          class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-white lg:text-5xl"
        >
          Online Voting System
        </h1>
        <p class="mt-[10px] text-center leading-7 text-muted-foreground">
          Take charge of your voting process with our easy-to-use platform. Create and manage your
          own voting events with complete control over every detail.
        </p>
      </div>

      <!-- <div class="relative mt-[10px] h-40 w-[40rem]">
      
        <div
          class="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
        ></div>
        <div
          class="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        ></div>
        <div
          class="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm"
        ></div>
        <div
          class="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent"
        ></div>


        <Sparkles
          minSize={0.8}
          maxSize={2}
          particleDensity={300}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={3}
        />

    
        <div
          class="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"
        ></div>
      </div> -->
    </div>
  </div>

  <div class="flex min-h-screen flex-col justify-center p-[1rem]">
    {#if $page.url.searchParams.get('q') === 'register'}
      <Register registerForm={data.registerForm} />
    {:else if $page.url.searchParams.get('q') === 'forgot-password'}
      <ForgotPassword forgotPwdForm={data.forgotPwdForm} />
    {:else}
      <Login loginForm={data.loginForm} />
    {/if}

    <div class="mx-auto mt-[10dvh] w-[300px] sm:w-[350px]">
      <p class="text-center text-sm leading-7 text-muted-foreground">
        By clicking continue, you agree to our <b class="underline">Terms of Service</b> and
        <b class="underline">Privacy Policy</b> .
      </p>
    </div>
  </div>
</div>
