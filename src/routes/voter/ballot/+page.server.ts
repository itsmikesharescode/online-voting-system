import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Voted } from '$lib/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	return {
		votedRef: (await supabase
			.from('voted_list_tb')
			.select('*')
			.match({
				voter_id: user?.id,
				admin_id: user?.user_metadata.adminId
			})
			.single()) as PostgrestSingleResponse<Voted>
	};
};

export const actions: Actions = {
	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		return {
			msg: 'Thank you come back again!'
		};
	}
};
