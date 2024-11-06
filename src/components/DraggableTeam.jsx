import { useDrag, useDrop } from "react-dnd";
import "./DraggableTeam.css";

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
      className="DraggableTeam-team"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: teamIndex === 0 ? "lightsalmon" : "lightblue",
        cursor: team ? "move" : "pointer",
      }}
    >
      {team ? team.name : "—"}
    </div>
  );
};

export default DraggableTeam;
