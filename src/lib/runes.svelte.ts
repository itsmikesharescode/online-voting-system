import type { User } from '@supabase/supabase-js';
import type { Candidate, LiveResult, Position, Voter } from './types';

interface Route {
	title: string;
	url: string;
}

class RouteState {
	private activeRoute = $state('');
	private themeState = $state<'light' | 'dark'>('light');
	private selections = $state<Route[]>([]);

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

class VoterState {
	private ballotContainer = $state<Candidate[]>([]);

	setBallot(b: Candidate[]) {
		this.ballotContainer = b;
	}

	getBallot() {
		return this.ballotContainer;
	}

	pushBallot(b: Candidate) {
		this.ballotContainer.push(b);
	}
}

export const voterState = new VoterState();
