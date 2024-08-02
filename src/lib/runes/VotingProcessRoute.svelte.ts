import type { LiveResult } from '$lib/types';
import { getContext, setContext } from 'svelte';

class VotingProcessRoute {
	private liveResultArr = $state<LiveResult[] | null>(null);

	setLiveResultArr = (param: LiveResult[] | null) => {
		this.liveResultArr = param;
	};

	getLiveResultArr = () => {
		return this.liveResultArr;
	};
}

const voting_process_key = Symbol('voting_process_key');

export const initVotingProcessRoute = () => {
	return setContext(voting_process_key, new VotingProcessRoute());
};

export const fromVotingProcessRouteState = () => {
	return getContext<ReturnType<typeof initVotingProcessRoute>>(voting_process_key);
};
