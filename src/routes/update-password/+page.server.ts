import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updatePwdSchema } from '$lib/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		updatePwdForm: await superValidate(zod(updatePwdSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	updatePwd: async (event) => {
		const { supabase } = event.locals;

		const form = await superValidate(event, zod(updatePwdSchema));

		if (!form.valid) return fail(401, { form });

		const {
			data: { user },
			error
		} = await supabase.auth.updateUser({
			password: form.data.newPwd
		});

		if (error) return message(form, { status: 401, msg: error.message });
		else if (user) {
			const { role } = user.user_metadata;

			let url = '';

			if (role === 'admin') url = '/admin';
			else if (role === 'role') url = '/voter';

			return message(form, { status: 200, msg: 'Password updated.', url });
		}
	}
};
