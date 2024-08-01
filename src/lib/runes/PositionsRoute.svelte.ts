import type { Position } from '$lib/types';
import { getContext, setContext } from 'svelte';

class PositionsRoute {
	private positionsArray = $state<Position[] | null>(null);
	private activeIndex = $state<Position | null>(null);

	setPositionsArray = (param: Position[] | null) => {
		this.positionsArray = param;
	};

	getPositionsArray = () => {
		return this.positionsArray;
	};

	setActiveIndex = (param: Position | null) => {
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

export const fromPositionsRouteState = () => {
	return getContext<ReturnType<typeof initPositionsRoute>>(position_route_key);
};
