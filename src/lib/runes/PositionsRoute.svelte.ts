import { getContext, setContext } from 'svelte';

class PositionsRoute {
	private positionsArray = $state<unknown>(null);
	private activeIndex = $state<unknown>(null);

	setPositionsArray = (param: unknown) => {
		this.positionsArray = param;
	};

	getPositionsArray = () => {
		return this.positionsArray;
	};

	setActiveIndex = (param: unknown) => {
		this.activeIndex = param;
	};

	getActiveIndex = () => {
		return this.activeIndex;
	};
}

const position_route_key = Symbol('position_route');

export const initPositionsRoute = () => {
	return setContext(position_route_key, new PositionsRoute());
};

export const fromPositionsRoute = () => {
	return getContext<ReturnType<typeof initPositionsRoute>>(position_route_key);
};
