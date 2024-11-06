import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TournamentBracket from "./TournamentBracket";
import DraggableAthlete from "./DraggableAthlete";
import athleteData from "../athletes.json";
import "./Home.css";

const generateRounds = (athleteCount) => {
  let rounds = [];

  // Calculate the closest power of 2 to accommodate all athletes
  const closestPowerOf2 = Math.pow(2, Math.ceil(Math.log2(athleteCount)));

  // Calculate how many seeds are needed for the first round, allowing for "bye" slots if needed
  let seeds = Array.from({ length: closestPowerOf2 / 2 }, (_, index) => ({
    id: index + 1,
    teams: [null, null],
  }));

  // Add the first round with any empty slots as "byes"
  rounds.push({ seeds });

  // Determine the total number of rounds based on the closest power of 2
  const roundsNeeded = Math.ceil(Math.log2(closestPowerOf2));

  // Generate subsequent rounds by halving the seeds each time
  for (let i = 1; i < roundsNeeded; i++) {
    seeds = Array.from({ length: seeds.length / 2 }, () => ({
      id: null,
      teams: [null, null],
    }));
    rounds.push({ seeds });
  }

  return rounds;
};

const Home = () => {
  const [rounds, setRounds] = useState([]);
  const [athletePool, setAthletePool] = useState([]);

  useEffect(() => {
    const savedRounds = JSON.parse(localStorage.getItem("bracketRounds"));

    if (savedRounds) {
      setRounds(savedRounds);

      // Collect athletes that are already placed in the bracket
      const athletesInBracket = new Set();
      savedRounds.forEach((round) =>
        round.seeds.forEach((seed) =>
          seed.teams.forEach((team) => {
            if (team && team.name) athletesInBracket.add(team.name);
          })
        )
      );

      // Filter the athlete pool to exclude those already in the bracket
      setAthletePool(
        athleteData.athletes.filter(
          (athlete) => !athletesInBracket.has(athlete)
        )
      );
    } else {
      setRounds(generateRounds(athleteData.athletes.length));
      setAthletePool(athleteData.athletes);
    }
  }, []);

  const moveAthleteToBracket = (athlete, target) => {
    const updatedRounds = JSON.parse(JSON.stringify(rounds));

    updatedRounds.forEach((round) => {
      round.seeds.forEach((seed) => {
        seed.teams = seed.teams.map((team) =>
          team && team.name === athlete ? null : team
        );
      });
    });

    updatedRounds[target.roundIndex].seeds[target.seedIndex].teams[
      target.teamIndex
    ] = { name: athlete };

    setRounds(updatedRounds);
    setAthletePool((prevPool) => prevPool.filter((a) => a !== athlete));

    localStorage.setItem("bracketRounds", JSON.stringify(updatedRounds));
  };

  const clearBracket = () => {
    localStorage.removeItem("bracketRounds");
    setRounds(generateRounds(athleteData.athletes.length));
    setAthletePool(athleteData.athletes);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TournamentBracket
        rounds={rounds}
        moveAthleteToBracket={moveAthleteToBracket}
      />

      {athletePool.length > 0 && (
        <div className="Home-spacing">
          <h3>Athlete Pool:</h3>
          {athletePool.map((athlete) => (
            <DraggableAthlete key={athlete} athlete={athlete} />
          ))}
        </div>
      )}

      <button onClick={clearBracket} className="Home-btn">
        Clear Bracket
      </button>
    </DndProvider>
  );
};

export default Home;
