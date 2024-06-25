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
	candidate_list_tb: Candidate[];
}

export interface Voted {
	voter_id: string;
	created_at: string;
	admin_id: string;
	display_name: string;
	voted_json: Candidate[];
}
