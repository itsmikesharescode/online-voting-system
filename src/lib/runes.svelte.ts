class RouteState {
	private activeRoute = $state('');

	getActiveRoute() {
		return this.activeRoute;
	}

	setActiveRoute(r: string) {
		this.activeRoute = r;
	}
}

export const routeState = new RouteState();
