import React from "react";
import { Bracket } from "react-brackets";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableTeam = ({
  team,
  roundIndex,
  seedIndex,
  teamIndex,
  moveAthleteToBracket,
}) => {
  const [, drop] = useDrop({
    accept: "ATHLETE",
    drop: (draggedAthlete) => {
      moveAthleteToBracket(draggedAthlete.name, {
        roundIndex,
        seedIndex,
        teamIndex,
      });
    },
    canDrop: () => team === null, // Only accept drops if the slot is empty
  });

  return (
    <div
      ref={drop}
      style={{
        padding: "8px",
        margin: "4px",
        backgroundColor: teamIndex === 0 ? "lightsalmon" : "lightblue",
        color: "white",
        textAlign: "center",
        border: "1px solid #ddd",
        minWidth: "200px",
        height: "30px",
      }}
    >
      {team ? team.name : "—"}
    </div>
  );
};

const TournamentBracket = ({ rounds, moveAthleteToBracket }) => {
  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
};

export default TournamentBracket;
