import type { Candidate } from '$lib/types';
import { getContext, setContext } from 'svelte';

class CandidatesRoute {
  private candidatesArray = $state<Candidate[] | null>(null);
  private activeIndex = $state<Candidate | null>(null);

  setCandidateArray = (param: Candidate[] | null) => {
    this.candidatesArray = param;
  };

  getCandidateArray = () => {
    return this.candidatesArray;
  };

  setActiveIndex = (param: Candidate) => {
    this.activeIndex = param;
  };

  getActiveIndex = () => {
    return this.activeIndex;
  };
}

const candidates_route_key = Symbol('candidates_route');

export const initCandidatesRoute = () => {
  return setContext(candidates_route_key, new CandidatesRoute());
};

export const fromCandidatesRouteState = () => {
  return getContext<ReturnType<typeof initCandidatesRoute>>(candidates_route_key);
};
