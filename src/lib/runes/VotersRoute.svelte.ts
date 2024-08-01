import type { Voter } from '$lib/types';
import { getContext, setContext } from 'svelte';

class VotersRoute {
	private votersArray = $state<Voter[] | null>(null);
	private activeIndex = $state<Voter | null>(null);

	setVotersArray(param: Voter[] | null) {
		this.votersArray = param;
	}

	getVotersArray() {
		return this.votersArray;
	}

	setActiveIndex = (param: Voter | null) => {
		this.activeIndex = param;
	};

	getActiveIndex = () => {
		return this.activeIndex;
	};
}

const voters_route_key = Symbol('voters_route');

export const initVotersRoute = () => {
	return setContext(voters_route_key, new VotersRoute());
};

export const fromVotersRouteState = () => {
	return getContext<ReturnType<typeof initVotersRoute>>(voters_route_key);
};
