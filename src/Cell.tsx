import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { BoardState } from "./features/boardSlice";
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
  clickHandler: (e: any, cell: Cell) => void;
}

const CellComponent: FC<CellProps> = (props) => {
  const { won, ended } = useSelector((state: RootState) => state.game);
  function setColor() {
    if (props.cell.revealed || ended) {
      if (won && props.cell.isBomb) {
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
      {(props.cell.revealed || ended) &&
        !props.cell.isBomb &&
        props.cell.bombNeighbour! > 0 &&
        props.cell.bombNeighbour}
    </div>
  );
};

export default CellComponent;
