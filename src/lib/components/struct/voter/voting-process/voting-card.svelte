<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { fromVotingProcessRouteState } from '$lib/runes/VotingProcessRoute.svelte';
  import type { Candidate, LiveResult } from '$lib/types';
  import BarChart from './bar-chart.svelte';
  import { UserRound, Vote, Undo } from 'lucide-svelte';

  interface Props {
    result: LiveResult;
  }

  const { result }: Props = $props();

  const votingProcessRoute = fromVotingProcessRouteState();

  // client side checker but not reliant database checks is a must
  const isVoted = (candidate: Candidate) => {
    const votesCopy = votingProcessRoute.getCastedVotes().map((item) => item.id);

    return votesCopy.includes(candidate.id);
  };

  const isMaxVote = () => {
    const votesCopyArr = votingProcessRoute.getCastedVotes();
    const maxVote = result.max_vote;

    const filtered = result.candidate_list_tb?.filter((item) => {
      return votesCopyArr.some((innerItem) => item.id === innerItem.id);
    });

    return maxVote === filtered?.length;
  };
</script>

<div class="flex h-fit flex-col gap-[10px] rounded-lg border-[1px] border-slate-700 p-[1rem]">
  <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
    {result.position_name}
  </h4>

  <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
    Max Vote: {result.max_vote}
  </h4>

  {#if result.candidate_list_tb?.length}
    <div class="flex flex-col gap-[10px]">
      <div class="grid grid-cols-[70%,30%]">
        <span>
          <p class="font-semibold">Name</p>
        </span>
      </div>

      <div class="flex h-[40dvh] flex-col gap-[10px] overflow-auto p-2">
        {#each result.candidate_list_tb as candidate}
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-[5px]">
              <UserRound class="h-[40px] w-[40px] rounded-full border-[1px] bg-secondary p-[5px]" />
              <p class="font-semibold">{candidate.display_name}</p>
            </div>

            <div class="">
              <Button
                disabled={isMaxVote()}
                variant={isVoted(candidate) ? 'destructive' : 'default'}
                class="flex items-center gap-[5px]"
                onclick={() => {
                  votingProcessRoute.castVote(candidate);
                  console.log(votingProcessRoute.getCastedVotes());
                }}
              >
                {#if isVoted(candidate)}
                  <Undo class="h-[15px] w-[15px]" />
                  Unvote
                {:else}
                  <Vote class="h-[15px] w-[15px]" />
                  Vote
                {/if}
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="flex h-[40dvh] items-center justify-center">
      <p class="leading-7 text-muted-foreground">No candidate atm</p>
    </div>
  {/if}
</div>
