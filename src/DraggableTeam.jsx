import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableTeam = ({
  team,
  roundIndex,
  seedIndex,
  teamIndex,
  moveAthleteToBracket,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ATHLETE",
    item: {
      name: team ? team.name : "",
      roundIndex,
      seedIndex,
      teamIndex,
      fromPool: false,
    },
    canDrag: () => team !== null, // Only draggable if there's a team
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "ATHLETE",
    drop: (draggedAthlete) => {
      if (draggedAthlete.fromPool || draggedAthlete.roundIndex !== undefined) {
        moveAthleteToBracket(draggedAthlete.name, {
          roundIndex,
          seedIndex,
          teamIndex,
        });
      }
    },
    canDrop: () => team === null, // Only allow drop if slot is empty
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "8px",
        margin: "4px",
        backgroundColor: teamIndex === 0 ? "lightsalmon" : "lightblue",
        color: "white",
        textAlign: "center",
        border: "1px solid #ddd",
        minWidth: "200px",
        height: "30px",
        cursor: team ? "move" : "pointer",
      }}
    >
      {team ? team.name : "—"}
    </div>
  );
};

export default DraggableTeam;
