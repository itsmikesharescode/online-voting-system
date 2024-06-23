export interface ResultModel<T> {
	status: number;
	type: string;
	data: T;
}

export type Voters = {
	voter_id: string;
	created_at: string;
	display_name: string;
	email: string;
	admin_id: string;
};

export type Positions = {
	id: number;
	created_at: string;
	max_vote: number;
	position_name: string;
};
