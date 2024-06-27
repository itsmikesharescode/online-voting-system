import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';

const sKey = import.meta.env.VITE_SB_KEY;
const sUrl = import.meta.env.VITE_SB_URL;

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(sUrl, sKey, {
				global: { fetch }
			})
		: createServerClient(sUrl, sKey, {
				global: { fetch },
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	const session = isBrowser() ? (await supabase.auth.getSession()).data.session : data.session;

	return { supabase, session };
};
