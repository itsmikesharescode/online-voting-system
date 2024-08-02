import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotPwdSchema, loginSchema, registerSchema } from '$lib/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	return {
		loginForm: await superValidate(zod(loginSchema)),
		registerForm: await superValidate(zod(registerSchema)),
		forgotPwdForm: await superValidate(zod(forgotPwdSchema))
	};
};

export const actions: Actions = {
	login: async (event) => {
		const { supabase } = event.locals;

		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) return fail(400, { form });

		const { data, error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) return fail(401, { form, msg: error.message });
		else if (data.user)
			return { form, msg: 'Welcome back!', user: data.user, role: data.user.user_metadata.role };
	},

	register: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(registerSchema));

		if (!form.valid) return fail(400, { form });

		const { data, error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				data: {
					displayName: form.data.displayName,
					role: 'admin'
				}
			}
		});

		if (error) return fail(401, { form, msg: error.message });
		else if (data.user) return { form, msg: 'Account created.', user: data.user };
	},

	forgotPwd: async (event) => {
		const {
			locals: { supabase },
			url
		} = event;
		const form = await superValidate(event, zod(forgotPwdSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.auth.resetPasswordForEmail(form.data.email);

		if (error) return fail(401, { form, msg: error.message });
		return {
			form,
			msg: `An email containing a password reset link had been sent to ${form.data.email}.`
		};
	}
};
