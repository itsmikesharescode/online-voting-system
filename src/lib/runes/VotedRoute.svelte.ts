import type { Voted } from '$lib/types';
import { getContext, setContext } from 'svelte';

class VotedRoute {
	private votedArray = $state<Voted[] | null>(null);
	private activeIndex = $state<Voted | null>(null);

	setVotedArray = (param: Voted[] | null) => {
		this.votedArray = param;
	};

	getVotedArray = () => {
		return this.votedArray;
	};

	setActiveIndex = (param: Voted | null) => {
		this.activeIndex = param;
	};

	getActiveIndex = () => {
		return this.activeIndex;
	};
}

const voted_route_key = Symbol('voted_route_key');

export const initVotedRoute = () => {
	return setContext(voted_route_key, new VotedRoute());
};

export const fromVotedRouteState = () => {
	return getContext<ReturnType<typeof initVotedRoute>>(voted_route_key);
};
