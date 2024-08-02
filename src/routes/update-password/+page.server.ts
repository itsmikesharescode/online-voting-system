import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updatePwdSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const { data, error } = await supabase.auth.verifyOtp({
		token_hash: url.searchParams.get('token') ?? '',
		type: 'email'
	});

	if (error) redirect(303, `/?error=${error.message.split(' ').join('-')}`);

	if (data.user) {
		return {
			user: data.user,
			role: data.user.user_metadata,
			updatePwdForm: await superValidate(zod(updatePwdSchema))
		};
	} else {
		return {
			updatePwdForm: await superValidate(zod(updatePwdSchema))
		};
	}
};

export const actions: Actions = {
	updatePwd: async (event) => {
		const { supabase } = event.locals;

		const form = await superValidate(event, zod(updatePwdSchema));

		if (!form.valid) return fail(400, { form });

		const {
			data: { user },
			error
		} = await supabase.auth.updateUser({
			password: form.data.newPwd
		});

		if (error) return fail(401, { form, msg: error.message });
		else if (user) {
			const { role } = user.user_metadata;

			return { form, msg: 'Password update', role, user };
		}
	}
};
