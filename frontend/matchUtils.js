export function outcome(match) {
  const [mine, theirs] = match.result.split('-').map(Number);
  if (mine > theirs) return 'WIN';
  if (mine < theirs) return 'LOSS';
  return 'DRAW';
}

export function getRecord(matches) {
  return matches.reduce(
    (record, match) => {
      const result = outcome(match);
      if (result === 'WIN') record.wins += 1;
      else if (result === 'LOSS') record.losses += 1;
      else record.draws += 1;
      return record;
    },
    { wins: 0, losses: 0, draws: 0 }
  );
}
