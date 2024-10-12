import type { Candidate } from './types';

type BallotType = {
  position_name: string;
  candidate_list_tb: Candidate[];
};

export function transformCandidates(candidates: Candidate[]) {
  const positionMap: { [key: string]: BallotType } = {};

  candidates.forEach((candidate) => {
    const position_id = candidate.position_id;
    const position_name = candidate.position_json.position_name;

    if (!positionMap[position_id]) {
      positionMap[position_id] = {
        position_name,
        candidate_list_tb: []
      };
    }

    positionMap[position_id].candidate_list_tb.push(candidate);
  });

  return Object.values(positionMap);
}
