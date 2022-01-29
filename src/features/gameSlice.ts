import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MinesweeperState {
  newGame: boolean;
  level: number;
  started: boolean;
  ended: boolean;
  won: boolean;
  numberOfFounded: number;
  remained: number;
}

const initialState: MinesweeperState = {
  level: 1,
  started: false,
  ended: false,
  won: false,
  newGame: true,  
  numberOfFounded: 0,
  remained: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    gameStarted: (state, action: PayloadAction<boolean>) => {
      state.started = action.payload;
      state.newGame = false;
    },
    gameEnded: (state, action: PayloadAction<boolean>) => {
      state.ended = true;
      state.won = action.payload;
      state.newGame = false;
      state.remained = action.payload ? 0 : state.remained;
    },
    startGame: (state, action: PayloadAction<any>) => {
      state.newGame = action.payload.newGame;
      state.level = action.payload.level;
      state.ended = false;
      state.started = false;
      state.won = false;
      state.numberOfFounded = 0;
      state.remained = 0;
    },
    flagChanged: (state, action: PayloadAction<boolean>) => {
      state.numberOfFounded += action.payload ? 1 : -1;
    },
    remainedChanged: (state, action: PayloadAction<number>) => {
      state.remained = action.payload;
    },
  },
});
export const {
  startGame,
  gameEnded,
  gameStarted,
  flagChanged,
  remainedChanged,
} = gameSlice.actions;
export default gameSlice.reducer;
