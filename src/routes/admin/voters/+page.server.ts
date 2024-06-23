import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createVoterSchema, updateVoterSchema } from '$lib/schema';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Voter } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	return {
		voters: (await supabase
			.from('voter_list_tb')
			.select('*')
			.eq('admin_id', user?.id)) as PostgrestSingleResponse<Voter[]>,
		createVoterForm: await superValidate(zod(createVoterSchema), { id: crypto.randomUUID() }),
		updateVoterForm: await superValidate(zod(updateVoterSchema), { id: crypto.randomUUID() })
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

	updateVoter: async (event) => {
		const {
			locals: { supabaseAdmin }
		} = event;

		const form = await superValidate(event, zod(updateVoterSchema));

		if (!form.valid) return fail(401, { form });

		const {
			data: { user },
			error
		} = await supabaseAdmin.auth.admin.updateUserById(form.data.voterId, {
			email: form.data.email,
			password: form.data.password,
			user_metadata: {
				displayName: form.data.displayName
			}
		});

		if (error) return message(form, { status: 401, msg: error.message });
		else if (user) return message(form, { status: 200, msg: 'Voter info has been updated.' });
	},

	deleteVoter: async ({ locals: { supabaseAdmin }, request }) => {
		const voterId = (await request.formData()).get('voterId') as string;

		const { error } = await supabaseAdmin.auth.admin.deleteUser(voterId);
		if (error) return fail(401, { msg: error.message });
		else return { msg: `Voter has been deleted.` };
	},

	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		return {
			msg: 'Thank you come back again!'
		};
	}
};
