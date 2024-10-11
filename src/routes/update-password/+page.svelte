<script lang="ts">
  import Sparkles from '$lib/components/ui/Sparkles/Sparkles.svelte';
  import { updatePwdSchema } from '$lib/schema';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import type { ResultModel } from '$lib/types.js';
  import { userState } from '$lib/runes/userState.svelte.js';
  import type { User } from '@supabase/supabase-js';

  const { data } = $props();

  const user = userState();

  const form = superForm(data.updatePwdForm, {
    validators: zodClient(updatePwdSchema),
    invalidateAll: false,
    id: crypto.randomUUID(),
    onUpdate({ result }) {
      const { status, data } = result as ResultModel<{
        msg: string;
        user: User;
        role: 'admin' | 'voter';
      }>;

      switch (status) {
        case 200:
          toast.success('Update Password', { description: data.msg });
          if (data.role === 'admin') goto('/admin', { invalidateAll: false });
          else if (data.role === 'voter') goto('/voter', { invalidateAll: false });
          user.setUser(data.user);
          break;
        case 401:
          toast.error('Update Password', { description: data.msg });
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, message } = form;
</script>

<div class="grid md:grid-cols-2">
  <div class="flex min-h-screen flex-col justify-center p-[1rem]">
    <div class="mx-auto grid w-[300px] gap-[20px] sm:w-[350px]">
      <div class="">
        <h3 class="scroll-m-20 text-center text-2xl font-semibold tracking-tight">
          Forgot Password
        </h3>
        <p class="text-center text-sm leading-7 text-muted-foreground">
          Enter your email to recover your password
        </p>
      </div>

      <form method="POST" action="?/updatePwd" use:enhance class="grid gap-[10px]">
        <Form.Field {form} name="newPwd">
          <Form.Control let:attrs>
            <Form.Label>New Password</Form.Label>
            <Input type="password" {...attrs} bind:value={$formData.newPwd} />
          </Form.Control>
          <Form.Description>Enter your new password.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="confirmNewPwd">
          <Form.Control let:attrs>
            <Form.Label>Confirm New Password</Form.Label>
            <Input type="password" {...attrs} bind:value={$formData.confirmNewPwd} />
          </Form.Control>
          <Form.Description>Confirm your new password.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button disabled={$submitting}>
          {#if $submitting}
            <LoaderCircle class="animate-spin" />
          {:else}
            Update Pasword
          {/if}
        </Form.Button>
      </form>

      <p class="text-center text-sm leading-7 text-muted-foreground">
        <b class="border-b-[1px] border-slate-700">Note:</b> Reloading this page will lose your chance
        to update your password.
      </p>
    </div>
  </div>

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

      <div class="relative mt-[10px] h-40 w-[40rem]">
        <!-- Gradients -->
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

        <!-- Core component -->
        <Sparkles
          minSize={0.8}
          maxSize={2}
          particleDensity={300}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={3}
        />

        <!-- Radial Gradient to prevent sharp edges -->
        <div
          class="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"
        ></div>
      </div>
    </div>
  </div>
</div>
