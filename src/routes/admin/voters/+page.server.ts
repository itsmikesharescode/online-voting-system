import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createVoterSchema } from '$lib/schema';

export const load: PageServerLoad = async () => {
	return {
		createVoterForm: await superValidate(zod(createVoterSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	createVoter: async (event) => {
		const form = await superValidate(event, zod(createVoterSchema));

		console.log(form.data);

		if (!form.valid) return fail(401, { form });

		return { form };
	},

	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		return {
			msg: 'Thank you come back again!'
		};
	}
};
