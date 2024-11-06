import React, { useEffect, useState } from "react";
import TournamentBracket from "./TournamentBracket";
import athleteData from "./athletes.json";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const generateRounds = (athleteCount) => {
  const initialSeeds = Array.from({ length: athleteCount / 2 }, (_, index) => ({
    id: index + 1,
    teams: [null, null],
  }));

  return [
    {
      seeds: initialSeeds,
    },
    {
      seeds: Array(initialSeeds.length / 2).fill({
        id: null,
        teams: [null, null],
      }),
    },
    {
      seeds: Array(initialSeeds.length / 4).fill({
        id: null,
        teams: [null, null],
      }),
    },
    {
      seeds: [{ id: null, teams: [null, null] }],
    },
  ];
};

const DraggableAthlete = ({ athlete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ATHLETE",
    item: { name: athlete },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "8px",
        margin: "4px",
        backgroundColor: "lightgreen",
        cursor: "move",
        textAlign: "center",
        border: "1px solid #ddd",
        width: "200px",
        height: "30px",
      }}
    >
      {athlete}
    </div>
  );
};

const App = () => {
  const [rounds, setRounds] = useState([]);
  const [athletePool, setAthletePool] = useState([]);

  useEffect(() => {
    setAthletePool(athleteData.athletes);
    setRounds(generateRounds(athleteData.athletes.length));
  }, []);

  const moveAthleteToBracket = (athlete, target) => {
    const updatedRounds = JSON.parse(JSON.stringify(rounds));

    if (
      updatedRounds[target.roundIndex].seeds[target.seedIndex].teams[
        target.teamIndex
      ] === null
    ) {
      updatedRounds[target.roundIndex].seeds[target.seedIndex].teams[
        target.teamIndex
      ] = { name: athlete };
      setRounds(updatedRounds);
      setAthletePool(athletePool.filter((a) => a !== athlete));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TournamentBracket
        rounds={rounds}
        moveAthleteToBracket={moveAthleteToBracket}
      />
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h3>Athlete Pool:</h3>
        {athletePool.map((athlete) => (
          <DraggableAthlete key={athlete} athlete={athlete} />
        ))}
      </div>
    </DndProvider>
  );
};

export default App;
