import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCandidateSchema } from '$lib/schema';

export const load: PageServerLoad = async () => {
	return {
		createCandidateForm: await superValidate(zod(createCandidateSchema), {
			id: crypto.randomUUID()
		})
	};
};

export const actions: Actions = {
	createCandidate: async (event) => {
		const {
			locals: { supabaseAdmin }
		} = event;

		const form = await superValidate(event, zod(createCandidateSchema));

		if (!form.valid) return fail(401, { form });
	},

	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		return {
			msg: 'Thank you come back again!'
		};
	}
};
