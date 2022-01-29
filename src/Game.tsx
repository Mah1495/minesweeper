import { useState } from "react";
import Board from "./Board";
import GameBar from "./GameBar";
export interface GameStatus {
  started: boolean;
  ended: boolean;
  level: number;
  handler?: (level: number) => void;
}

const Game = () => {
  const gameChanged = (status: { started: boolean; ended: boolean }) => {
    setState({ ...state, started: status.started, ended: status.ended });
  };

  const [state, setState] = useState<GameStatus>({
    started: false,
    ended: false,
    level: 1,
  });

  return (
    <div className="game">
      <div>
        <GameBar />
        <Board />
      </div>
    </div>
  );
};

export default Game;
