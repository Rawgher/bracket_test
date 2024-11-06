import { useDrag } from "react-dnd";
import "./DraggableAthlete.css";

const DraggableAthlete = ({ athlete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ATHLETE",
    item: { name: athlete, fromPool: true },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="DraggableAthlete-athlete"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {athlete}
    </div>
  );
};

export default DraggableAthlete;
