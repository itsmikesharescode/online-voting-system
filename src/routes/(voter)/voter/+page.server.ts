import type { PageServerLoad } from './$types';
import type { LiveResult } from '$lib/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  return {
    results: (await supabase
      .from('position_list_tb')
      .select('*, candidate_list_tb(*)')
      .eq('admin_id', user?.user_metadata.adminId)
      .order('created_at', { ascending: true })) as PostgrestSingleResponse<LiveResult[]>
  };
};
