import type { PageServerLoad } from './$types';
import type { Voted } from '$lib/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, user }, setHeaders }) => {
  setHeaders({
    'Cache-Control': 'private, max-age=36000, stale-while-revalidate=36000',
    Vary: 'Cookie, Authorization'
  });

  return {
    votedRef: (await supabase
      .from('voted_list_tb')
      .select('*')
      .match({
        voter_id: user?.id,
        admin_id: user?.user_metadata.adminId
      })
      .single()) as PostgrestSingleResponse<Voted>
  };
};
