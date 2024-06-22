import { z } from 'zod';

// static schemas
export const loginSchema = z.object({
	email: z.string().email({ message: 'Must enter a valid email.' }),
	password: z.string().min(1, { message: 'Must enter a valid password.' })
});

export const registerSchema = z
	.object({
		displayName: z
			.string()
			.min(4, { message: 'Must enter a valid display name.' })
			.max(25, { message: 'Max char is 25.' }),
		email: z
			.string()
			.email({ message: 'Must enter a valid email.' })
			.max(40, { message: 'Max char is 40.' }),
		password: z.string().min(6, { message: 'Must choose a strong password.' }),
		confirmPassword: z.string()
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm password must match.',
				path: ['confirmPassword']
			});
		}
	});

export const forgotPwdSchema = z.object({
	email: z.string().email({ message: 'Must enter a valid email.' })
});

export type LoginSchema = typeof loginSchema;
export type RegisterSchema = typeof registerSchema;
export type ForgotPwdSchema = typeof forgotPwdSchema;

// admin schema
export const createVoterSchema = z
	.object({
		adminId: z.string(),
		displayName: z
			.string()
			.min(4, { message: 'Must enter a valid display name.' })
			.max(25, { message: 'Max char is 25.' }),
		email: z
			.string()
			.email({ message: 'Must enter a valid email.' })
			.max(40, { message: 'Max char is 40.' }),
		password: z.string().min(6, { message: 'Must choose a strong password.' }),
		confirmPassword: z.string()
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm password must match.',
				path: ['confirmPassword']
			});
		}
	});

export type CreateVoterSchema = typeof createVoterSchema;
