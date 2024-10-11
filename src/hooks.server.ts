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

  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();

    if (!session) return { session: null, user: null };

    try {
      const decoded = jwt.verify(session.access_token, jwtSecret) as SupabaseJwt;
      const validated_session: Session = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: decoded.exp,
        expires_in: decoded.exp - Math.round(Date.now() / 1000),
        token_type: 'bearer',
        user: {
          app_metadata: decoded.app_metadata ?? {},
          aud: 'authenticated',
          created_at: '',
          id: decoded.sub,
          user_metadata: decoded.user_metadata
        }
      };

      return { session: validated_session, user: validated_session.user };
    } catch (err) {
      return { session: null, user: null };
    }
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.getSession();
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

export const handle: Handle = sequence(supabase, authGuard);
