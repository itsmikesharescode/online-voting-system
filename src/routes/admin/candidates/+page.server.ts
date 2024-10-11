import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCandidateSchema, updateCandidateSchema } from '$lib/schema';
import type { Candidate, Position } from '$lib/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const load: PageServerLoad = async () => {
  return {
    createCandidateForm: await superValidate(zod(createCandidateSchema)),
    updateCandidateForm: await superValidate(zod(updateCandidateSchema))
  };
};

export const actions: Actions = {
  createCandidate: async (event) => {
    const {
      locals: { supabase }
    } = event;

    const form = await superValidate(event, zod(createCandidateSchema));
    if (!form.valid) return fail(400, { form });

    const selectedPosition = JSON.parse(form.data.selectedPosition) as Position;

    const { data, error } = (await supabase.rpc('create_candidate', {
      position_id_client: selectedPosition.id,
      display_name_client: form.data.displayName,
      motto_client_client: form.data.motto,
      position_json_client: selectedPosition
    })) as PostgrestSingleResponse<Candidate[]>;

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'You have created a candidate', data };
  },

  updateCandidate: async (event) => {
    const {
      locals: { supabase }
    } = event;

    const form = await superValidate(event, zod(updateCandidateSchema));
    if (!form.valid) return fail(400, { form });

    const selectedPosition = JSON.parse(form.data.selectedPosition) as Position;

    const { data, error } = (await supabase.rpc('update_candidate', {
      display_name_client: form.data.displayName,
      motto_client: form.data.motto,
      candidate_id_client: Number(form.data.candidateId),
      position_json_client: selectedPosition
    })) as PostgrestSingleResponse<Candidate[]>;

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'You have update the candidate', data };
  },

  deleteCandidate: async ({ locals: { supabase }, request }) => {
    const formData = await request.formData();
    const candidateId = formData.get('candidateId') as string;
    const { data, error } = (await supabase.rpc('delete_candidate', {
      candidate_id_client: Number(candidateId)
    })) as PostgrestSingleResponse<Candidate[]>;

    if (error) return fail(401, { msg: error.message });
    return { msg: 'You have delete a candidate', data };
  }
};
