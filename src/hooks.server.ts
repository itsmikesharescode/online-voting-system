import { createServerClient } from '@supabase/ssr';
import type { Session, User } from '@supabase/supabase-js';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';
import type { SupabaseJwt } from '$lib/types';

const sKey = import.meta.env.VITE_SB_KEY;
const sUrl = import.meta.env.VITE_SB_URL;
const jwtSecret = import.meta.env.VITE_JWT_KEY;
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

		const fakeSession = session;

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

	// for update password
	if (event.url.pathname === '/update-password') {
		const {
			data: { user: tokenUser },
			error
		} = await event.locals.supabase.auth.verifyOtp({
			token_hash: event.url.searchParams.get('q') ?? '',
			type: 'email'
		});

		if (!tokenUser) redirect(301, '/');
	}

	// for voter
	if (event.url.pathname.startsWith('/voter')) {
		if (user) {
			const { role } = user.user_metadata;
			if (role === 'admin') redirect(301, '/admin');

			const { data, error } = await event.locals.supabase
				.from('voted_list_tb')
				.select('*')
				.match({
					voter_id: user?.id,
					admin_id: user?.user_metadata.adminId
				})
				.single();

			if (!data) redirect(303, '/voting-process');
		} else {
			redirect(303, '/');
		}
	}

	if (event.url.pathname.startsWith('/voting-process')) {
		if (user) {
			const { role } = user.user_metadata;
			if (role === 'admin') redirect(301, '/admin');

			const { data, error } = await event.locals.supabase
				.from('voted_list_tb')
				.select('*')
				.match({
					voter_id: user.id,
					admin_id: user.user_metadata.adminId
				})
				.single();

			if (data) redirect(303, '/voter');
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
