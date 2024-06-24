import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const sKey = import.meta.env.VITE_SB_KEY;
const sUrl = import.meta.env.VITE_SB_URL;
const sAdminKey = import.meta.env.VITE_SB_ADMIN_KEY;

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(sUrl, sKey, {
		cookies: {
			get: (key) => event.cookies.get(key),

			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	event.locals.supabaseAdmin = createServerClient(sUrl, sAdminKey, {
		cookies: {
			get: (key) => event.cookies.get(key),

			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}
		// work around for supabase token console spammer
		delete session.user;

		return { session: Object.assign({}, session, { user }), user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// for root
	if (event.url.pathname === '/') {
		if (user) {
			const { role } = user.user_metadata;
			if (role === 'admin') redirect(301, '/admin');
			else if (role === 'voter') redirect(301, '/voting-process');
		}
	}

	// for voter
	if (event.url.pathname.startsWith('/voter')) {
		if (user) {
			const { role } = user.user_metadata;
			if (role === 'admin') redirect(301, '/admin');
		} else {
			redirect(303, '/');
		}
	}

	if (event.url.pathname.startsWith('/voting-process')) {
		if (user) {
			const { role } = user.user_metadata;
			if (role === 'admin') redirect(301, '/admin');
		} else {
			redirect(303, '/');
		}
	}

	// for admin
	if (event.url.pathname.startsWith('/admin')) {
		if (user) {
			const { role } = user.user_metadata;
			if (role === 'voter') redirect(301, '/voter');
		} else {
			redirect(303, '/');
		}
	}

	return resolve(event);
};

const workers: Handle = async ({ event, resolve }) => {
	// image uploads here
	// cloudflare or vercel
	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard, workers);
