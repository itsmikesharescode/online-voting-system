import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCandidateSchema, updateCandidateSchema } from '$lib/schema';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Candidate, Position } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	return {
		candidates: (await supabase
			.from('candidate_list_tb')
			.select('*')
			.eq('admin_id', user?.id)) as PostgrestSingleResponse<Candidate[]>,
		positions: (await supabase
			.from('position_list_tb')
			.select('*')
			.eq('admin_id', user?.id)) as PostgrestSingleResponse<Position[]>,
		createCandidateForm: await superValidate(zod(createCandidateSchema), {
			id: crypto.randomUUID()
		}),
		updateCandidateForm: await superValidate(zod(updateCandidateSchema), {
			id: crypto.randomUUID()
		})
	};
};

export const actions: Actions = {
	createCandidate: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(createCandidateSchema));
		if (!form.valid) return fail(401, { form });

		const selectedPosition = JSON.parse(form.data.selectedPosition) as Position;

		const { error } = await supabase.from('candidate_list_tb').insert([
			{
				admin_id: form.data.adminId,
				display_name: form.data.displayName,
				motto: form.data.motto,
				position_id: selectedPosition.id,
				position_json: selectedPosition
			}
		]);

		if (error) return message(form, { status: 401, msg: error.message });
		else return message(form, { status: 200, msg: 'Added a candidate.' });
	},

	updateCandidate: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(updateCandidateSchema));
		if (!form.valid) return fail(401, { form });

		const selectedPosition = JSON.parse(form.data.selectedPosition) as Position;

		const { error } = await supabase
			.from('candidate_list_tb')
			.update([
				{
					admin_id: form.data.adminId,
					display_name: form.data.displayName,
					motto: form.data.motto,
					position_id: selectedPosition.id,
					position_json: selectedPosition
				}
			])
			.match({ admin_id: form.data.adminId, id: form.data.candidateId });

		if (error) return message(form, { status: 401, msg: error.message });
		else return message(form, { status: 200, msg: 'Updated a candidate.' });
	},

	deleteCandidate: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const adminId = formData.get('adminId') as string;
		const candidateId = formData.get('candidateId') as string;

		const { error } = await supabase
			.from('candidate_list_tb')
			.delete()
			.match({ admin_id: adminId, id: candidateId });

		if (error) return fail(401, { msg: error.message });
		else return { msg: 'Deleted a candidated.' };
	},

	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		return {
			msg: 'Thank you come back again!'
		};
	}
};
