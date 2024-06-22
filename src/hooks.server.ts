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

		return { session, user };
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

	if (
		(!event.locals.session && event.url.pathname.startsWith('/voter')) ||
		(!event.locals.session && event.url.pathname.startsWith('/admin'))
	) {
		redirect(303, '/');
	}

	if (event.locals.session && event.url.pathname === '/admin') {
		const {
			user: {
				user_metadata: { role }
			}
		} = event.locals.session;

		if (role === 'voter') redirect(301, '/voter');
	}

	if (event.locals.session && event.url.pathname === '/voter') {
		const {
			user: {
				user_metadata: { role }
			}
		} = event.locals.session;

		if (role === 'admin') redirect(301, '/admin');
	}

	return resolve(event);
};

const workers: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard, workers);
