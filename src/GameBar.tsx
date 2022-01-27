import { useEffect, useState } from "react";
import { GameStatus } from "./Game";

const GameBar = function (props: GameStatus) {
  const [timer, setTimer] = useState(0);
  const [level, setLevel] = useState(() => props.level);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (props.started) {
      interval = setInterval(() => {
        setTimer((old) => old + 1);
      }, 1000);
      if (props.ended) {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [props]);
  return (
    <div className="bar">
      <div>
        <input
          onChange={() => setLevel(1)}
          checked={level == 1}
          id="easy"
          name="level"
          type={"radio"}
        />
        <label htmlFor="easy">Easy</label>

        <input
          onChange={() => setLevel(2)}
          checked={level == 2}
          id="intermediate"
          name="level"
          type={"radio"}
        />
        <label htmlFor="intermediate">Intermediate</label>

        <input
          onChange={() => setLevel(3)}
          checked={level == 3}
          id="expert"
          name="level"
          type={"radio"}
        />
        <label htmlFor="expert">Expert</label>
        <button onClick={() => props.handler!(level)}>New Game</button>
      </div>
      <div>{timer}</div>
    </div>
  );
};

export default GameBar;
