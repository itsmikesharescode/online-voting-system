import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPositionSchema } from '$lib/schema';

export const load: PageServerLoad = async () => {
	return {
		createPositionForm: await superValidate(zod(createPositionSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	createPosition: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(createPositionSchema));

		if (!form.valid) return fail(401, { form });

		const { error } = await supabase.rpc('insert_position', {
			admin_id_client: form.data.adminId,
			max_vote_client: form.data.maxVote,
			position_name_client: form.data.positionName
		});

		if (error) return message(form, { status: 401, msg: error.message });
		else {
			event.setHeaders({
				'Cache-Control': 'no-store, max-age=0',
				Pragma: 'no-cache',
				Expires: '0'
			});

			return message(form, { status: 200, msg: 'Position created.' });
		}
	},

	deletePositon: async ({ locals: { supabase }, request }) => {
		const positionId = (await request.formData()).get('positionId') as string;

		const { error } = await supabase.from('position_list_tb').delete().eq('id', positionId);
		if (error) return fail(401, { msg: error.message });
		else return { msg: 'Position has been deleted.' };
	}
};
