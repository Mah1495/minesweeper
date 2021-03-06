import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/gameSlice";
import boardReducer from "../features/boardSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    board: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
