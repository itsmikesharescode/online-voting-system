import { getContext, setContext } from 'svelte';

class VotersRoute {
	private votersArray = $state<unknown>(null);
	private activeIndex = $state<unknown>(null);

	setVotersArray(param: unknown) {
		this.votersArray = param;
	}

	getVotersArray() {
		return this.votersArray;
	}

	setActiveIndex = (param: unknown) => {
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
