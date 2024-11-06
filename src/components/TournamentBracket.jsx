import { Bracket } from "react-brackets";
import DraggableTeam from "./DraggableTeam";

const TournamentBracket = ({ rounds, moveAthleteToBracket }) => {
  return (
    <Bracket
      rounds={rounds.map((round, roundIndex) => ({
        ...round,
        seeds: round.seeds.map((seed, seedIndex) => ({
          ...seed,
          teams: seed.teams.map((team, teamIndex) => ({
            name: (
              <DraggableTeam
                key={`${roundIndex}-${seedIndex}-${teamIndex}`}
                team={team}
                roundIndex={roundIndex}
                seedIndex={seedIndex}
                teamIndex={teamIndex}
                moveAthleteToBracket={moveAthleteToBracket}
              />
            ),
          })),
        })),
      }))}
    />
  );
};

export default TournamentBracket;
