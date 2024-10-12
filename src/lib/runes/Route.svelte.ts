import type { User } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';

interface RouteType {
  title: string;
  url: string;
}

class Route {
  private activeRoute = $state('');
  private themeState = $state<'light' | 'dark'>('light');
  private selections = $state<RouteType[]>([]);

  setRoute(param: string) {
    this.activeRoute = param;
  }

  getRoute() {
    return this.activeRoute;
  }

  getThemeState() {
    return this.themeState;
  }

  setThemeState(t: 'light' | 'dark') {
    this.themeState = t;
  }

  getSelections() {
    return this.selections;
  }

  setSelections(u: User | null) {
    if (u) {
      const { role } = u.user_metadata;
      if (role === 'admin')
        this.selections = [
          {
            title: 'Dashboard',
            url: '/admin'
          },

          {
            title: 'Result',
            url: '/admin/result'
          },

          {
            title: 'Voters',
            url: '/admin/voters'
          },

          {
            title: 'Positions',
            url: '/admin/positions'
          },

          {
            title: 'Candidates',
            url: '/admin/candidates'
          }
        ];
      else if (role === 'voter')
        this.selections = [
          {
            title: 'Result',
            url: '/voter'
          },

          {
            title: 'Ballot',
            url: '/voter/ballot'
          }
        ];
    } else this.selections = [];
  }
}

const route_key = Symbol('route_key');

export const initRoute = () => {
  return setContext(route_key, new Route());
};

export const routeState = () => {
  return getContext<ReturnType<typeof initRoute>>(route_key);
};
