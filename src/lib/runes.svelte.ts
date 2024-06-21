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
