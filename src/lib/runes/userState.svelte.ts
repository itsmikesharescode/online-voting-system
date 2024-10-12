import type { User } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';

class UserState {
  private user = $state<User | null>(null);

  setUser(param: User | null) {
    this.user = param;
  }

  getUser() {
    return this.user;
  }
}

const user_state_key = Symbol('user_state_key');

export const initUser = () => {
  return setContext(user_state_key, new UserState());
};

export const userState = () => {
  return getContext<ReturnType<typeof initUser>>(user_state_key);
};
