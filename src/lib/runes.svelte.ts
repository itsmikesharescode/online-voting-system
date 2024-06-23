import type { Candidate, Position, Voter } from './types';

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
	}

	setThemeState(t: 'light' | 'dark') {
		this.themeState = t;
	}
}

export const routeState = new RouteState();

class AdminState {
	private selectedVoter = $state<Voter | null>(null);
	private selectedPosition = $state<Position | null>(null);
	private selectedCandidate = $state<Candidate | null>(null);

	getSelectedVoter() {
		return this.selectedVoter;
	}

	setSelectedVoter(v: Voter | null) {
		this.selectedVoter = v;
	}

	getSelectedPosition() {
		return this.selectedPosition;
	}

	setSelectedPosition(p: Position | null) {
		this.selectedPosition = p;
	}

	getSelectedCandidate() {
		return this.selectedCandidate;
	}

	setSelectedCandidate(c: Candidate | null) {
		this.selectedCandidate = c;
	}
}

export const adminState = new AdminState();
