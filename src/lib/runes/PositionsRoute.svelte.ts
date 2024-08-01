import { getContext, setContext } from 'svelte';

class PositionRoute {
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

export const initPositionRoute = () => {
	return setContext(position_route_key, new PositionRoute());
};

export const fromPositionRoute = () => {
	return getContext<ReturnType<typeof initPositionRoute>>(position_route_key);
};
