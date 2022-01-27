import React, { useEffect, useState } from "react";
import CellComponent, { Cell } from "./Cell";
import { GameStatus } from "./Game";
import {
  GameState,
  startGame,
  revealed,
  EventType,
  CountRemainedCells,
} from "./Utils";

const Board = (props: any) => {
  let mouseDown: boolean = false;
  console.log(props);
  const [started, setStarted] = useState(false);
  const isGameOver = () => {
    if (state.gameOver) return;
    const remained = CountRemainedCells(state.cells);
    if (remained == state.bombs.length) {
      setState({ ...state, gameOver: true, won: true });
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
      setState({ ...state, gameOver: true });
    } else {
      const cleared = revealed(cell, [...state.cells]);
      setState({
        ...state,
        cells: state.cells.map((r) =>
          r.map((c) =>
            cleared.includes(c) ? { ...c, revealed: true } : { ...c }
          )
        ),
      });
    }
  };
  const revealNeighbours = (cell: Cell) => {
    if (cell.revealed) {
      let flaggedNeigbours: number = 0;
      let neighbours: Cell[] = [];
      cell.neighbours!.forEach((n) => {
        let nb = state.cells[n[0]][n[1]];
        if (nb.flaged) {
          flaggedNeigbours++;
        } else if (!nb.revealed) neighbours.push(nb);
      });
      if (flaggedNeigbours == cell.bombNeighbour) {
        if (neighbours.filter((m) => m.isBomb).length > 0) {
          setState({ ...state, gameOver: true });
        } else {
          let cleared: [Cell[]] = [[]];
          neighbours.forEach((m) => cleared.push(revealed(m, state.cells)));
          let all = cleared.flat();
          setState({
            ...state,
            cells: state.cells.map((m) =>
              m.map((s) =>
                all.includes(s) ? { ...s, revealed: true } : { ...s }
              )
            ),
          });
        }
      }
    }
  };
  const flagHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    cell: Cell
  ) => {
    e.preventDefault();
    if (!cell.revealed) {
      setState({
        ...state,
        cells: state.cells.map((m) =>
          m.map((s) =>
            s.id == cell.id ? { ...s, flaged: !s.flaged } : { ...s }
          )
        ),
      });
    }
  };

  const handler = (e: React.MouseEvent<HTMLDivElement>, cell: Cell) => {
    e.preventDefault();
    setStarted(true);
    if (e.button == 1) {
      revealNeighbours(cell);
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
          revealNeighbours(cell);
        }
        mouseDown = true;
        break;
      case EventType.mouseup:
        mouseDown = false;
        break;
    }
  };

  const [state, setState] = useState<GameState>(() => {
    const game = startGame(props.rows, props.columns, props.bombs);
    return game;
  });

  useEffect(() => {
    props.handler!({ started: started, ended: state.gameOver });
  }, [state, started]);

  useEffect(() => {
    setState(startGame(props.rows, props.columns, props.bombs));
  }, [props.rows]);

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${props.rows}, 50px)`,
      }}
    >
      {state.cells.map((row) =>
        row.map((column) => (
          <CellComponent
            key={column.id}
            state={state}
            cell={column}
            clickHandler={handler}
          />
        ))
      )}
    </div>
  );
};

export default Board;
