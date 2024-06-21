import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const session = await safeGetSession();

	if (!session.user) redirect(302, '/');

	const {
		user_metadata: { role }
	} = session.user;

	if (role !== 'admin') redirect(302, '/voter');

	return {
		user: session.user
	};
};
