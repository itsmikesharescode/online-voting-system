import type { Candidate, LiveResult } from '$lib/types';
import { getContext, setContext } from 'svelte';

class VotingProcessRoute {
  private liveResultArr = $state<LiveResult[] | null>(null);

  setLiveResultArr = (param: LiveResult[] | null) => {
    this.liveResultArr = param;
  };

  getLiveResultArr = () => {
    return this.liveResultArr;
  };

  private castedVotes = $state<Candidate[]>([]);

  setCastedVotes = (param: Candidate[]) => {
    this.castedVotes = param;
  };

  getCastedVotes = () => {
    return this.castedVotes;
  };

  castVote = (param: Candidate) => {
    const votesCopy = this.castedVotes.map((item) => item.id);
    if (votesCopy.includes(param.id)) {
      this.castedVotes = this.castedVotes.filter((item) => item.id !== param.id);
    } else this.castedVotes.push(param);
  };
}

const voting_process_key = Symbol('voting_process_key');

export const initVotingProcessRoute = () => {
  return setContext(voting_process_key, new VotingProcessRoute());
};

export const fromVotingProcessRouteState = () => {
  return getContext<ReturnType<typeof initVotingProcessRoute>>(voting_process_key);
};
