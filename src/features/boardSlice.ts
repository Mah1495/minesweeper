import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cell } from "../Cell";
import { revealed, startGame } from "../Utils";

export interface BoardState {
  bombs: number[];
  cells: Cell[][];
  exploded: boolean;
}
const initialState: BoardState = {
  bombs: [],
  cells: [],
  exploded: false,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    start: (state, action: PayloadAction<number>) => {
      const g = startGame(action.payload);
      state.bombs = g.bombs;
      state.cells = g.cells;
    },

    cellCleared: (state, action: PayloadAction<Cell>) => {
      const cleared = revealed(action.payload, state.cells);
      state.cells = state.cells.map((r) =>
        r.map((c) => {
          c.revealed = cleared.includes(c) ? true : c.revealed;
          return c;
        })
      );
    },
    clearNeighbours: (state, action: PayloadAction<Cell>) => {
      if (action.payload.revealed) {
        let flaggedNeigbours: number = 0;
        let neighbours: Cell[] = [];
        action.payload.neighbours!.forEach((n) => {
          let nb = state.cells[n[0]][n[1]];
          if (nb.flaged) {
            flaggedNeigbours++;
          } else if (!nb.revealed) neighbours.push(nb);
        });
        if (flaggedNeigbours == action.payload.bombNeighbour) {
          if (neighbours.filter((m) => m.isBomb).length > 0) {
            state.exploded = true;
          } else {
            let cleared: [Cell[]] = [[]];
            neighbours.forEach((m) => cleared.push(revealed(m, state.cells)));
            let all = cleared.flat();
            state.cells = state.cells.map((m) =>
              m.map((s) => {
                s.revealed = all.includes(s) ? true : s.revealed;
                return s;
              })
            );
          }
        }
      }
    },
    cellFlaged: (state, action: PayloadAction<Cell>) => {
      state.cells = state.cells.map((m) =>
        m.map((s) => {
          s.flaged = s.id == action.payload.id ? true : s.flaged;
          return s;
        })
      );
    },
  },
});
export const { cellCleared, cellFlaged, clearNeighbours, start } =
  boardSlice.actions;
export default boardSlice.reducer;
