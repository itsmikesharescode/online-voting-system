import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotPwdSchema, loginSchema, registerSchema } from '$lib/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		loginForm: await superValidate(zod(loginSchema), { id: crypto.randomUUID() }),
		registerForm: await superValidate(zod(registerSchema), { id: crypto.randomUUID() }),
		forgotPwdForm: await superValidate(zod(forgotPwdSchema), { id: crypto.randomUUID() })
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) return fail(401, { form });

		return { form };
	},

	register: async (event) => {
		const form = await superValidate(event, zod(registerSchema));

		if (!form.valid) return fail(401, { form });

		return { form };
	},

	forgotPwd: async (event) => {
		const form = await superValidate(event, zod(forgotPwdSchema));

		if (!form.valid) return fail(401, { form });
		return { form };
	}
};
