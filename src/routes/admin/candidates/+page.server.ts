import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCandidateSchema, updateCandidateSchema } from '$lib/schema';
import type { Candidate, Position } from '$lib/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const load: PageServerLoad = async () => {
	return {
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
		if (!form.valid) return fail(400, { form });

		const selectedPosition = JSON.parse(form.data.selectedPosition) as Position;

		const { data, error } = (await supabase.rpc('create_candidate', {
			position_id_client: selectedPosition.id,
			display_name_client: form.data.displayName,
			motto_client_client: form.data.motto,
			position_json_client: selectedPosition
		})) as PostgrestSingleResponse<Candidate[]>;

		if (error) return fail(401, { form, msg: error.message });
		return { form, msg: 'You have created a candidate', data };
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
	}
};
