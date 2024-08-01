import { getContext, setContext } from 'svelte';

class CandidatesRoute {
	private candidatesArray = $state<unknown>(null);
	private activeIndex = $state<unknown>(null);

	setCandidateArray = (param: unknown) => {
		this.candidatesArray = param;
	};

	getCandidateArray = () => {
		return this.candidatesArray;
	};

	setActiveIndex = (param: unknown) => {
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
