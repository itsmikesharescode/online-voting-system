import type { SupabaseClient } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';

class SupabaseState {
  private supabase = $state<SupabaseClient>();

  set(p: SupabaseClient) {
    this.supabase = p;
  }

  get() {
    return this.supabase;
  }
}

const SupabaseStateKey = Symbol(crypto.randomUUID());

export const initSupabaseState = () => {
  return setContext(SupabaseStateKey, new SupabaseState());
};

export const fromSupabaseState = () => {
  return getContext<ReturnType<typeof initSupabaseState>>(SupabaseStateKey);
};
