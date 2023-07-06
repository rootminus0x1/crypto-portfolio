import { createSlice } from '@reduxjs/toolkit';



export interface PriceState {
  value: number | null;
  status: 'idle' | 'loading' | 'failed';
}

/*
const initialPriceState: PriceState = {
  value: null,
  status: 'idle',
};
*/

export const priceMapSlice = createSlice({
    name: 'PriceMap'.
    priceMap: { [symbol: string]: PriceState; } = {},

    reducers: {
        setPrice: (state, action: PayloadAction<PriceState>) => {
            priceMap[string] = action.payload;
        }
    }
}

export const { setPrice } = counterSlice.actions;

export const selectPrice = (state: rootState, symbol: string) => priceMap[symbol];

export default PriceMapSlice.reducer;
