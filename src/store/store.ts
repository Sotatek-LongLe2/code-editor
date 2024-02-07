import { configureStore } from '@reduxjs/toolkit';
import treeSlice from './features/tree/treeSlice';


export const store = configureStore({
  reducer: {
    tree: treeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
