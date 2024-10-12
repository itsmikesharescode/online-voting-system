import type { SupabaseJwt } from '$lib/types';
import { createServerClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';

const sKey = import.meta.env.VITE_SB_KEY;
const sUrl = import.meta.env.VITE_SB_URL;
const jwtSecret = import.meta.env.VITE_JWT_KEY;
const sAdminKey = import.meta.env.VITE_SB_ADMIN_KEY;

const supabase: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(sUrl, sKey, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  });

  event.locals.supabaseAdmin = createServerClient(sUrl, sAdminKey, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
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

  const path = event.url.pathname;

  const adminRoutes = [
    '/admin',
    '/admin/result',
    '/admin/voters',
    '/admin/positions',
    '/admin/candidates'
  ];

  const voterRoutes = ['/voter', '/voter/voting-process'];

  if (user && adminRoutes.includes(path)) {
    const { role } = user.user_metadata;
    if (role !== 'admin') redirect(303, '/voting-process');
  }

  if (user && voterRoutes.includes(path)) {
    const { role } = user.user_metadata;
    if (role !== 'voter') redirect(303, '/admin');
  }

  if (!user && adminRoutes.includes(path)) redirect(303, '/?error=login-first');
  if (!user && voterRoutes.includes(path)) redirect(303, '/?error=login-first');

  return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
