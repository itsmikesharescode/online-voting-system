import type { LiveResult } from '$lib/types';
import { getContext, setContext } from 'svelte';

class LiveResultRoute {
  private liveResultArray = $state<LiveResult[] | null>(null);
  private activeIndex = $state<LiveResult | null>(null);

  setLiveResultArray = (param: LiveResult[] | null) => {
    this.liveResultArray = param;
  };

  getLiveResultArray = () => {
    return this.liveResultArray;
  };

  setActiveIndex = (param: LiveResult) => {
    this.activeIndex = param;
  };

  getActiveIndex = () => {
    return this.activeIndex;
  };
}

const live_result_route_key = Symbol('live_result_route');

export const initLiveResultRoute = () => {
  return setContext(live_result_route_key, new LiveResultRoute());
};

export const fromLiveResultRouteState = () => {
  return getContext<ReturnType<typeof initLiveResultRoute>>(live_result_route_key);
};
