import type { SupabaseClient, User } from '@supabase/supabase-js';

import type { Session } from '@supabase/supabase-js';
import type Xendit from 'xendit-node';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			supabaseAdmin: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			compressImage: (fileObject: File, targetSizeKB?: number) => Promise<Blob | null>;
		}
	}
}

export {};
