import { getContext, setContext } from 'svelte';

class LiveResultRoute {
	private liveResult = $state<unknown>(null);
	private activeIndex = $state<unknown>(null);

	setLiveResult(param: unknown) {
		this.liveResult = param;
	}

	getLiveResult() {
		return this.liveResult;
	}

	setActiveIndex(param: unknown) {
		this.activeIndex = param;
	}

	getActiveIndex() {
		return this.activeIndex;
	}
}

const live_result_key = Symbol('liveRoute');

export const initLiveRoute = () => {
	return setContext(live_result_key, new LiveResultRoute());
};

export const fromLiveRouteState = () => {
	return getContext<ReturnType<typeof initLiveRoute>>(live_result_key);
};
