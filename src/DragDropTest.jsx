import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableItem = ({ name }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "16px",
        margin: "8px",
        backgroundColor: "lightgreen",
        cursor: "move",
        border: "1px solid #ddd",
      }}
    >
      {name}
    </div>
  );
};

const DroppableArea = ({ onDrop }) => {
  const [, drop] = useDrop({
    accept: "ITEM",
    drop: (item) => {
      console.log("Dropped item:", item.name);
      onDrop(item.name);
    },
  });

  return (
    <div
      ref={drop}
      style={{
        padding: "32px",
        margin: "16px",
        backgroundColor: "lightblue",
        border: "2px dashed #ddd",
      }}
    >
      Drop Here
    </div>
  );
};

const DragDropTest = () => {
  const handleDrop = (name) => {
    alert(`Dropped: ${name}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h2>Drag and Drop Test</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <DraggableItem name="Test Item 1" />
        <DroppableArea onDrop={handleDrop} />
      </div>
    </DndProvider>
  );
};

export default DragDropTest;
