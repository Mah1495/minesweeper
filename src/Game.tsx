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
  const levelChanged = (level: number) => {
    setState({ ...state, level });
  };
  const [rows, cols, bombs] = [
    [10, 8, 10],
    [18, 14, 40],
    [24, 20, 99],
  ][state.level - 1];

  return (
    <div className="game">
      <div>
        <GameBar
          started={state.started}
          ended={state.ended}
          level={state.level}
          handler={levelChanged}
        />
        <Board rows={rows} columns={cols} bombs={bombs} handler={gameChanged} />
      </div>
    </div>
  );
};

export default Game;
