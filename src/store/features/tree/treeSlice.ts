import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TTreeState = {
  treeStructure: { [key: string]: boolean };
  newCreateValue: string;
};

const initialState: TTreeState = {
  treeStructure: {},
  newCreateValue: '',
};

export const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    toggleVisibility: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.treeStructure[`${action.payload.key}`] = action.payload.value;
    },
  },
});

export const { toggleVisibility } = treeSlice.actions;

export default treeSlice.reducer;
