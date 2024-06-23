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
};
