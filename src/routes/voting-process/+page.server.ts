import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Candidate, LiveResult } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase, user }, setHeaders }) => {
	const results = await supabase
		.from('position_list_tb')
		.select('*, candidate_list_tb(*)')
		.eq('admin_id', user?.user_metadata.adminId);

	return {
		results: results as PostgrestSingleResponse<LiveResult[]>
	};
};

export const actions: Actions = {
	insertVote: async ({ locals: { supabase }, request }) => {
		type ClientData = {
			displayName: string;
			voterId: string;
			adminId: string;
			votes: Candidate[];
		};

		const formData = await request.formData();
		const serialVotes = formData.get('serialVotes') as string;
		const clientData = JSON.parse(serialVotes) as ClientData;

		const { error } = await supabase.rpc('insert_votes', {
			client_display_name: clientData.displayName,
			client_voter_id: clientData.voterId,
			client_admin_id: clientData.adminId,
			client_candidates: clientData.votes
		});

		if (error) return fail(401, { msg: error.message });
		else return { msg: 'You have successfully voted.' };
	},

	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) return fail(401, { msg: error.message });

		return {
			msg: 'Thank you come back again!'
		};
	}
};
