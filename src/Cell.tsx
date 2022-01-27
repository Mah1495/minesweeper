import { FC, MouseEventHandler } from "react";
import { GameState } from "./Utils";

export interface Cell {
  id: number;
  row?: number;
  column?: number;
  isBomb: boolean;
  bombNeighbour?: number;
  neighbours?: [number[]];
  revealed: boolean;
  flaged: boolean;
}

export interface CellProps {
  cell: Cell;
  state: GameState;
  clickHandler: (e: any, cell: Cell) => void;
}

const CellComponent: FC<CellProps> = (props) => {
  function setColor() {
    if (props.cell.revealed || props.state.gameOver) {
      if (props.state.won && props.cell.isBomb) {
        return "coral";
      }
      if (props.cell.isBomb) {
        return "red";
      }
      return "gray";
    }
    if (props.cell.flaged) {
      return "blue";
    }
    return "";
  }
  return (
    <div
      onContextMenu={(e) => props.clickHandler(e, props.cell)}
      className="cell"
      style={{
        backgroundColor: setColor(),
      }}
      onClick={(e) => props.clickHandler(e, props.cell)}
      onMouseDown={(e) => props.clickHandler(e, props.cell)}
      onMouseUp={(e) => props.clickHandler(e, props.cell)}
    >
      {(props.cell.revealed || props.state.gameOver) &&
        !props.cell.isBomb &&
        props.cell.bombNeighbour! > 0 &&
        props.cell.bombNeighbour}
    </div>
  );
};

export default CellComponent;
