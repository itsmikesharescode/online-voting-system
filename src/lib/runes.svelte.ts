import type { User } from '@supabase/supabase-js';
import type { Candidate, LiveResult, Position, Voter } from './types';

class VoterState {
	private ballotContainer = $state<Candidate[]>([]);

	getVotes() {
		return this.ballotContainer;
	}

	getVotesByPosition(position_id: string): number {
		return this.getVotes().filter((candidate) => candidate.position_id === position_id).length;
	}

	setVotes(newCandidate: Candidate) {
		this.ballotContainer.push(newCandidate);
	}

	removeVote(candidateToRemove: Candidate) {
		this.ballotContainer = this.ballotContainer.filter(
			(candidate) => candidate.id !== candidateToRemove.id
		);
	}

	resetVote() {
		this.ballotContainer = [];
	}
}

export const voterState = new VoterState();
