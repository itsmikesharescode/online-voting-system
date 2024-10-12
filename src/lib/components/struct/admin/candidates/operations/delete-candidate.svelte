<script lang="ts">
  import { enhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { Candidate, ResultModel } from '$lib/types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { fromCandidatesRouteState } from '$lib/runes/CandidatesRoute.svelte';

  interface Props {
    openDelete: boolean;
  }

  let { openDelete = $bindable() }: Props = $props();

  const candidateRoute = fromCandidatesRouteState();

  let deleteLoader = $state(false);
  const deleteCandidate: SubmitFunction = () => {
    deleteLoader = true;
    return async ({ result }) => {
      const { status, data } = result as ResultModel<{ msg: string; data: Candidate[] }>;

      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          candidateRoute.setCandidateArray(data.data);
          deleteLoader = false;
          openDelete = false;
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
        This action cannot be undone. This will permanently delete candidate {candidateRoute.getActiveIndex()
          ?.display_name}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleteLoader} onclick={() => (openDelete = false)}>
        Cancel
      </AlertDialog.Cancel>

      <form method="post" action="?/deleteCandidate" use:enhance={deleteCandidate}>
        <input name="candidateId" type="hidden" value={candidateRoute.getActiveIndex()?.id} />
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
