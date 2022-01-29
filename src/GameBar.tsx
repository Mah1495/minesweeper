import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { startGame } from "./features/gameSlice";

const GameBar = function () {
  const [timer, setTimer] = useState(0);
  const dispatch = useDispatch();

  const { started, ended, numberOfFounded, remained } = useSelector(
    (state: RootState) => state.game
  );

  const [level, setLevel] = useState(
    useSelector((state: RootState) => state.game.level)
  );

  const levelChangedHandler = () => {
    dispatch(startGame({ newGame: true, level: level }));
    setTimer(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (started) {
      interval = setInterval(() => {
        setTimer((old) => old + 1);
      }, 1000);
      if (ended) {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [started, ended]);
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
        <button onClick={levelChangedHandler}>New Game</button>
      </div>

      <div>
        Time:{timer} <br />
        <span>Flagged:{numberOfFounded}</span>
        <span>Remained: {remained}</span>
      </div>
    </div>
  );
};

export default GameBar;
