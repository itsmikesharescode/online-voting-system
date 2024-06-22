import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createVoterSchema } from '$lib/schema';

export const load: PageServerLoad = async () => {
	return {
		createVoterForm: await superValidate(zod(createVoterSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	createVoter: async (event) => {
		const {
			locals: { supabaseAdmin }
		} = event;

		const form = await superValidate(event, zod(createVoterSchema));

		if (!form.valid) return fail(401, { form });

		const {
			data: { user },
			error
		} = await supabaseAdmin.auth.admin.createUser({
			email: form.data.email,
			password: form.data.password,
			email_confirm: true,
			user_metadata: {
				displayName: form.data.displayName,
				role: 'voter',
				adminId: form.data.adminId
			}
		});

		if (error) return message(form, { status: 401, msg: error.message });
		else if (user) return message(form, { status: 200, msg: 'Account Created.' });
	},

	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		return {
			msg: 'Thank you come back again!'
		};
	}
};
