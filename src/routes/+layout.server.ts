import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session, user }, cookies }) => {
	return { session, cookies: cookies.getAll(), user };
};
