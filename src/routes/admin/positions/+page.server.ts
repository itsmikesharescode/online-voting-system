import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPositionSchema } from '$lib/schema';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Position } from '$lib/types';

export const load: PageServerLoad = async () => {
	return {
		createPositionForm: await superValidate(zod(createPositionSchema))
	};
};

export const actions: Actions = {
	createPosition: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(createPositionSchema));

		if (!form.valid) return fail(400, { form });

		const { data, error } = (await supabase.rpc('create_position', {
			max_vote_client: form.data.maxVote,
			position_name_client: form.data.positionName
		})) as PostgrestSingleResponse<Position[]>;

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'You have create a position.', data };
	},

	deletePositon: async ({ locals: { supabase }, request }) => {
		const positionId = (await request.formData()).get('positionId') as string;

		const { data, error } = (await supabase.rpc('delete_position', {
			position_id_client: Number(positionId)
		})) as PostgrestSingleResponse<Position[]>;

		if (error) return fail(401, { msg: error.message });
		return { msg: 'You have delete this position', data };
	}
};
