import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StorePlaidState {
  plaidToken: string;
}

export const PlaidSlice = createSlice({
  name: 'plaid',
  initialState: {
    plaidToken: '',
  } as StorePlaidState,
  reducers: {
    setPlaidId: (state: StorePlaidState, action: PayloadAction<string>) => {
      state.plaidToken = action.payload;
    },
  },
});

export const { setPlaidId } = PlaidSlice.actions;
export const getPlaidToken = (state: any) => state.plaid.plaidToken;
