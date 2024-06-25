import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user }, setHeaders }) => {
	/* setHeaders({
		'Cache-Control': 'private, max-age=60, stale-while-revalidate=600',
		Vary: 'Cookie, Authorization'
	}); */

	return {
		totalVoter: await supabase
			.from('voter_list_tb')
			.select('*', { count: 'exact', head: true })
			.eq('admin_id', user?.id),
		totalVoted: await supabase
			.from('voted_list_tb')
			.select('*', { count: 'exact', head: true })
			.eq('admin_id', user?.id),
		totalPositions: await supabase
			.from('position_list_tb')
			.select('*', { count: 'exact', head: true })
			.eq('admin_id', user?.id),
		totalCandidates: await supabase
			.from('candidate_list_tb')
			.select('*', { count: 'exact', head: true })
			.eq('admin_id', user?.id)
	};
};

export const actions: Actions = {
	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) return fail(401, { msg: error.message });

		return {
			msg: 'Thank you come back again!'
		};
	}
};
