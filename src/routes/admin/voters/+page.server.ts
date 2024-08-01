import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createVoterSchema, updateVoterSchema } from '$lib/schema';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Voter } from '$lib/types';

export const load: PageServerLoad = async () => {
	return {
		createVoterForm: await superValidate(zod(createVoterSchema), { id: crypto.randomUUID() }),
		updateVoterForm: await superValidate(zod(updateVoterSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	createVoter: async (event) => {
		const {
			locals: { supabaseAdmin, user }
		} = event;

		const form = await superValidate(event, zod(createVoterSchema));

		if (!form.valid) return fail(400, { form });

		const {
			data: { user: voter },
			error: createErr
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

		if (createErr) return fail(401, { form, msg: createErr.message });
		else if (voter) {
			const { data, error } = (await supabaseAdmin
				.from('voter_list_tb')
				.select()
				.eq('admin_id', user?.id)
				.order('created_at', { ascending: true })) as PostgrestSingleResponse<Voter[]>;

			if (error) return fail(401, { form, msg: error.message });

			return { form, msg: 'Voter created.', data };
		}
	},

	updateVoter: async (event) => {
		const {
			locals: { supabaseAdmin, user }
		} = event;

		const form = await superValidate(event, zod(updateVoterSchema));

		if (!form.valid) return fail(400, { form });

		const {
			data: { user: voter },
			error: updateErr
		} = await supabaseAdmin.auth.admin.updateUserById(form.data.voterId, {
			email: form.data.email,
			password: form.data.password,
			user_metadata: {
				displayName: form.data.displayName
			}
		});

		if (updateErr) return fail(401, { form, msg: updateErr.message });
		else if (voter) {
			const { data, error } = (await supabaseAdmin
				.from('voter_list_tb')
				.select()
				.eq('admin_id', user?.id)
				.order('created_at', { ascending: true })) as PostgrestSingleResponse<Voter[]>;

			if (error) return fail(401, { form, msg: error.message });

			return { form, msg: 'Voter info updated.', data };
		}
	},

	deleteVoter: async ({ locals: { supabaseAdmin, user }, request }) => {
		const voterId = (await request.formData()).get('voterId') as string;

		const { error } = await supabaseAdmin.auth.admin.deleteUser(voterId);
		if (error) return fail(401, { msg: error.message });
		else {
			const { data, error } = (await supabaseAdmin
				.from('voter_list_tb')
				.select()
				.eq('admin_id', user?.id)
				.order('created_at', { ascending: true })) as PostgrestSingleResponse<Voter[]>;

			if (error) return fail(401, { msg: error.message });
			return { msg: 'Voter has been deleted.', data };
		}
	}
};
