import { Cell } from "./Cell";

export enum EventType {
  click = "click",
  mouseup = "mouseup",
  contextmenu = "contextmenu",
  mousedown = "mousedown",
}

export interface GameState {
  bombs: number[];
  cells: Cell[][];
  setted?: number;
  gameOver: boolean;
  won: boolean;
}

export const CountRemainedCells = (cells: Cell[][]): number => {
  return cells.flat().filter((m) => !m.revealed).length;
};

function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

export const startGame = (
  width: number,
  height: number,
  numBombs: number
): GameState => {
  const bombs: number[] = [];
  while (bombs.length < numBombs) {
    const bomb = Math.floor(Math.random() * width * height);
    if (!bombs.includes(bomb)) bombs.push(bomb);
  }
  const cells = Array.from(Array(height).keys()).map((row) =>
    Array.from(Array(width).keys()).map((column) => {
      let id = row * width + column;
      let isBomb = bombs.filter((i) => i === id).length > 0;
      let props: Cell = {
        id: id,
        row,
        column,
        isBomb: isBomb,
        revealed: false,
        flaged: false,
      };
      return props;
    })
  );
  findNeighbourBombs(cells);
  return { cells, bombs, gameOver: false, won: false };
};

function findCell(row: number, column: number, cells: Cell[][]) {
  let r = cells[row];
  if (r) {
    let c = r[column];
    if (c) {
      return c;
    }
  }
}
export function findNeighbourBombs(cells: Cell[][]) {
  const arr = [];
  arr.push(findCell(0, 0, cells));
  const places = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  cells.forEach((row) => {
    row.forEach((cell) => {
      cell.bombNeighbour = 0;
      cell.neighbours = [[]];
      cell.neighbours.pop();
      places.forEach((r) => {
        const pivot = [(cell.row ?? 0) + r[0], (cell.column ?? 0) + r[1]];
        let neighbour = findCell(pivot[0], pivot[1], cells);
        if (neighbour && neighbour.isBomb) {
          cell.bombNeighbour = (cell.bombNeighbour ?? 0) + 1;
        }
        if (neighbour) {
          cell.neighbours?.push([pivot[0], pivot[1]]);
        }
      });
    });
  });
}

export function revealed(cell: Cell, cells: Cell[][]): Cell[] {
  const cleared: Cell[] = [];
  cleared.push(cells[cell.row!][cell.column!]);
  const traversed: number[] = [];

  while (cleared.length > 0) {
    let cell = cleared.shift();
    traversed.push(cell!.id);
    cell!.revealed = true;
    if (cell!.bombNeighbour == 0)
      cell?.neighbours!.forEach((n) => {
        let neighbor = cells[n[0]][n[1]];
        if (!neighbor.revealed && !cleared.includes(neighbor))
          cleared.push(neighbor);
      });
  }
  return cleared;
}
