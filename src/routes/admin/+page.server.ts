import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) return fail(401, { msg: error.message });

		return {
			msg: 'Thank you come back again!'
		};
	}
};
