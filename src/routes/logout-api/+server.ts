import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabase }, request }) => {
  const { error } = await supabase.auth.signOut();

  if (error) return json({ msg: error.message }, { status: 401 });

  return json({ msg: 'Thank you! come back again!' });
};
