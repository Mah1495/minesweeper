import {
  cellCleared,
  cellFlaged,
  clearNeighbours,
  start,
} from "./features/boardSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import CellComponent, { Cell } from "./Cell";
import {
  flagChanged,
  gameEnded,
  gameStarted,
  remainedChanged,
} from "./features/gameSlice";
import { EventType, CountRemainedCells, GameLevelData } from "./Utils";

const Board = () => {
  const level = useSelector((state: RootState) => state.game.level);
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const boardState = useSelector((state: RootState) => state.board);

  let mouseDown: boolean = false;

  const isGameOver = () => {
    if (gameState.ended) return;
    if (boardState.cells.length <= 0) return;
    if (boardState.exploded) {
      dispatch(gameEnded(false));
      return;
    }

    const remained = CountRemainedCells(boardState.cells);
    if (remained != gameState.remained) {
      dispatch(remainedChanged(remained));
    }
    if (remained == boardState.bombs.length) {
      //you won the game
      dispatch(gameEnded(true));
      return true;
    }
    return false;
  };

  useEffect(() => {
    isGameOver();
  });

  const handleClick = (cell: Cell) => {
    if (cell.flaged) {
      return;
    }
    if (cell.isBomb) {
      dispatch(gameEnded(false));
    } else {
      dispatch(cellCleared(cell));
    }
  };

  const flagHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    cell: Cell
  ) => {
    e.preventDefault();
    if (!cell.revealed) {
      dispatch(cellFlaged(cell));
      dispatch(flagChanged(!cell.flaged));
    }
  };

  const handler = (e: React.MouseEvent<HTMLDivElement>, cell: Cell) => {
    e.preventDefault();
    dispatch(gameStarted(true));
    if (e.button == 1) {
      dispatch(clearNeighbours(cell));
      return;
    }
    switch (e.type) {
      case EventType.click:
        handleClick(cell);
        break;
      case EventType.contextmenu:
        flagHandler(e, cell);
        break;
      case EventType.mousedown:
        if (mouseDown) {
          dispatch(clearNeighbours(cell));
        }
        mouseDown = true;
        break;
      case EventType.mouseup:
        mouseDown = false;
        break;
    }
  };

  useEffect(() => {
    if (gameState.newGame) {
      dispatch(start(level));
    }
  }, [gameState]);

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${GameLevelData[level - 1][0]}, 50px)`,
      }}
    >
      {boardState.cells.map((row) =>
        row.map((column) => (
          <CellComponent key={column.id} cell={column} clickHandler={handler} />
        ))
      )}
    </div>
  );
};

export default Board;
