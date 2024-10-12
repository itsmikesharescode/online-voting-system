<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { ResultModel } from '$lib/types';
  import * as Card from '$lib/components/ui/card';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { transformCandidates } from '$lib/helpers';
  import { LoaderCircle } from 'lucide-svelte';
  import { userState } from '$lib/runes/userState.svelte';
  import { fromVotingProcessRouteState } from '$lib/runes/VotingProcessRoute.svelte';
  import { ListChecks, Check } from 'lucide-svelte';

  const user = userState();
  const votingProcessRoute = fromVotingProcessRouteState();

  let open = $state(false);

  let submitLoader = $state(false);
  const insertVote: SubmitFunction = () => {
    submitLoader = true;
    return async ({ result, update }) => {
      const {
        status,
        data: { msg }
      } = result as ResultModel<{ msg: string }>;

      switch (status) {
        case 200:
          toast.success('', { description: msg });
          votingProcessRoute.setCastedVotes([]);
          goto('/voter', { invalidateAll: true });
          break;

        case 401:
          toast.error('', { description: msg });
          submitLoader = false;
          break;
      }
      await update();
    };
  };
</script>

<Button onclick={() => (open = true)} class="flex items-center gap-[5px]">
  <ListChecks class="h-[15px] w-[15px]" />
  View Ballot
</Button>

<AlertDialog.Root bind:open>
  <AlertDialog.Content class="flex h-[100dvh] max-w-[100dvw] flex-col">
    <AlertDialog.Header>
      <AlertDialog.Title>Voting Ballot Penoy</AlertDialog.Title>
      <AlertDialog.Description>Voting ballot penoy hopya mani popcorn</AlertDialog.Description>
    </AlertDialog.Header>

    <div class="h-full overflow-auto">
      {#each transformCandidates(votingProcessRoute.getCastedVotes()) as position}
        <div class="grid gap-[10px] p-[10px]">
          <p class="text-xl font-semibold">{position.position_name}</p>
          {#each position.candidate_list_tb as candidate}
            <div class="grid grid-cols-[15px,1fr] items-center gap-[5px] text-muted-foreground">
              <Check class="h-[15px] w-[15px] " />
              <p class="">{candidate.display_name}</p>
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <form
      method="post"
      action="?/insertVote"
      use:enhance={insertVote}
      class="flex items-center justify-end gap-[10px]"
    >
      <input
        name="serialVotes"
        hidden
        value={JSON.stringify({
          displayName: user.getUser()?.user_metadata.displayName,
          voterId: user.getUser()?.id,
          adminId: user.getUser()?.user_metadata.adminId,
          votes: votingProcessRoute.getCastedVotes()
        })}
      />
      <Button variant="secondary" onclick={() => (open = false)}>Close</Button>
      <Button disabled={submitLoader} type="submit">
        {#if submitLoader}
          <LoaderCircle class="animate-spin" />
        {:else}
          Submit Vote
        {/if}
      </Button>
    </form>
  </AlertDialog.Content>
</AlertDialog.Root>
