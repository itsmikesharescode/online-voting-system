import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotPwdSchema, loginSchema, registerSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		loginForm: await superValidate(zod(loginSchema), { id: crypto.randomUUID() }),
		registerForm: await superValidate(zod(registerSchema), { id: crypto.randomUUID() }),
		forgotPwdForm: await superValidate(zod(forgotPwdSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	login: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) return fail(401, { form });

		const {
			data: { user },
			error
		} = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) return message(form, { status: 401, msg: error.message });
		else if (user) return message(form, { status: 200, msg: 'Welcome back.' });
		else return message(form, { status: 401, msg: 'Server error.' });
	},

	register: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod(registerSchema));

		if (!form.valid) return fail(401, { form });

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

		if (error) return message(form, { status: 401, msg: error.message });
		else return message(form, { status: 200, msg: 'Account created.' });
	},

	forgotPwd: async (event) => {
		const {
			locals: { supabase }
		} = event;
		const form = await superValidate(event, zod(forgotPwdSchema));

		if (!form.valid) return fail(401, { form });

		const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
			redirectTo: '/update-password'
		});

		if (error) return message(form, { status: 401, msg: error.message });

		return message(form, {
			status: 200,
			msg: `An email containing a password reset link had been sent to ${form.data.email}.`
		});
	}
};
