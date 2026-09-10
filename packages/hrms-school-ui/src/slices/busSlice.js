import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	buses: [],
};

const busSlice = createSlice({
	name: 'bus',
	initialState,
	reducers: {
		updateBus(state, action) {
			const bus = action.payload;
			const idx = state.buses.findIndex(b => b.id === bus.id);
			if (idx !== -1) {
				state.buses[idx] = { ...state.buses[idx], ...bus };
			} else {
				state.buses.push(bus);
			}
		},
		setBuses(state, action) {
			state.buses = action.payload;
		},
	},
});

export const { updateBus, setBuses } = busSlice.actions;
export default busSlice.reducer;
