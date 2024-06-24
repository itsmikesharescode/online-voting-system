import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { LiveResult } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	return {
		results: (await supabase
			.from('position_list_tb')
			.select('*, candidate_list_tb(*)')
			.eq('admin_id', user?.user_metadata.adminId)) as PostgrestSingleResponse<LiveResult[]>
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
