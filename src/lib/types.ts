import type { User, UserMetadata } from '@supabase/supabase-js';

export interface ResultModel<T> {
	status: number;
	type: string;
	data: T;
}

export type Voter = {
	voter_id: string;
	created_at: string;
	display_name: string;
	email: string;
	admin_id: string;
};

export type Position = {
	id: number;
	created_at: string;
	max_vote: number;
	position_name: string;
};

export type Candidate = {
	id: number;
	created_at: string;
	admin_id: string;
	position_id: string;
	display_name: string;
	motto: string;
	position_json: Position;
	vote_count: number;
};

//custom types
export interface LiveResult {
	id: number;
	created_at: string;
	max_vote: number;
	position_name: string;
	candidate_list_tb: Candidate[] | null;
}

export interface Voted {
	voter_id: string;
	created_at: string;
	admin_id: string;
	display_name: string;
	voted_json: Candidate[];
}

//supabase workaround
export type SupabaseJwt = {
	aal: string;
	aud: string;
	email: string;
	exp: number;
	iat: number;
	phone: string;
	role: string;
	session_id: string;
	sub: string;
	amr?: { method: string; timestamp: number }[];
	app_metadata?: {
		provider?: string;
		providers?: string[];
		[key: string]: any;
	};
	is_anonymous?: boolean;
	iss?: string;
	jti?: string;
	nbf?: string;
	user_metadata: UserMetadata;
};

export type FakeSession = {
	access_token: string;
	expires_in: number;
	expires_at: number;
	refresh_token: string;
	user?: User;
};

export interface AdminLoadType {
	live_results: LiveResult[] | null;
	candidates: Candidate[] | null;
	voters: Voter[] | null;
	voted_voters: Voted[] | null;
	positions: Position[] | null;
}
