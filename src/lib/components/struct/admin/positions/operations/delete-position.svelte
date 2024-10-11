<script lang="ts">
  import { enhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { Position, ResultModel } from '$lib/types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { fromPositionsRouteState } from '$lib/runes/PositionsRoute.svelte';

  interface Props {
    openDelete: boolean;
  }

  let { openDelete = $bindable() }: Props = $props();

  const positionsRoute = fromPositionsRouteState();

  let deleteLoader = $state(false);
  const deletePositon: SubmitFunction = () => {
    deleteLoader = true;
    return async ({ result, update }) => {
      const { status, data } = result as ResultModel<{ msg: string; data: Position[] }>;

      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          positionsRoute.setPositionsArray(data.data);
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
        This action cannot be undone. This will permanently delete the position {positionsRoute.getActiveIndex()
          ?.position_name}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleteLoader} onclick={() => (openDelete = false)}>
        Cancel
      </AlertDialog.Cancel>

      <form method="post" action="?/deletePositon" use:enhance={deletePositon}>
        <input name="positionId" type="hidden" value={positionsRoute.getActiveIndex()?.id} />
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
