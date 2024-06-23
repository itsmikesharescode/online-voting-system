import type { Positions, Voters } from './types';

class RouteState {
	private activeRoute = $state('');
	private themeState = $state<'light' | 'dark'>('light');

	getActiveRoute() {
		return this.activeRoute;
	}

	setActiveRoute(r: string) {
		this.activeRoute = r;
	}

	getThemeState() {
		return this.themeState;
		/* if (this.themeState === 'light') {
			return 'rgb(255, 255, 255)';
		} else {
			return 'rgb(0,0,0)';
		} */
	}

	setThemeState(t: 'light' | 'dark') {
		this.themeState = t;
	}
}

export const routeState = new RouteState();

class AdminState {
	private selectedVoter = $state<Voters | null>(null);
	private selectedPosition = $state<Positions | null>(null);

	getSelectedVoter() {
		return this.selectedVoter;
	}

	setSelectedVoter(v: Voters | null) {
		this.selectedVoter = v;
	}

	getSelectedPosition() {
		return this.selectedPosition;
	}

	setSelectedPosition(p: Positions | null) {
		this.selectedPosition = p;
	}
}

export const adminState = new AdminState();
