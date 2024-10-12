<script lang="ts">
  import { enhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { ResultModel, Voter } from '$lib/types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { fromVotersRouteState } from '$lib/runes/VotersRoute.svelte';

  interface Props {
    openDelete: boolean;
  }

  let { openDelete = $bindable() }: Props = $props();

  const votersRoute = fromVotersRouteState();

  let deleteLoader = $state(false);
  const deleteVoter: SubmitFunction = () => {
    deleteLoader = true;
    return async ({ result, update }) => {
      const { status, data } = result as ResultModel<{ msg: string; data: Voter[] }>;

      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          deleteLoader = false;
          openDelete = false;
          votersRoute.setVotersArray(data.data);
          break;

        case 401:
          toast.error('', { description: data.msg });
          deleteLoader = false;
          break;
      }
    };
  };
</script>

<AlertDialog.Root bind:open={openDelete}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleteLoader} onclick={() => (openDelete = false)}
        >Cancel</AlertDialog.Cancel
      >

      <form method="post" action="?/deleteVoter" use:enhance={deleteVoter}>
        <input name="voterId" type="hidden" value={votersRoute.getActiveIndex()?.voter_id} />
        <Button disabled={deleteLoader} type="submit" class="w-full">
          {#if deleteLoader}
            <LoaderCircle class="animate-spin" />
          {:else}
            Yes, delete
          {/if}
        </Button>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
