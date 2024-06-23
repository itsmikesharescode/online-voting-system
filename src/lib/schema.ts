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
export const updateVoterSchema = z
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

export const createPositionSchema = z.object({
	adminId: z.string(),
	positionName: z.string().min(3, { message: 'Must enter a proper position name.' }),
	maxVote: z.number().refine((v) => v > 0, { message: 'Max vote must be greater than 1.' })
});

export const createCandidateSchema = z.object({
	adminId: z.string(),
	selectedPosition: z.string().min(3, { message: 'Must select an available position.' }),
	displayName: z
		.string()
		.min(4, { message: 'Must enter a valid display name.' })
		.max(25, { message: 'Max char is 25.' }),
	motto: z
		.string()
		.min(5, { message: 'Minimum of 5 char.' })
		.max(250, { message: 'Max char is 250.' })
});

export type CreateVoterSchema = typeof createVoterSchema;
export type UpdateVoterSchema = typeof updateVoterSchema;

export type CreatePositionSchema = typeof createPositionSchema;
export type CreateCandidateSchema = typeof createCandidateSchema;
