import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const orderPersistConfig = {
  key: "order",
  storage:AsyncStorage
};
const initialState = {
  orders: [], 
  rentals: [],
};

const guestOrderSlice = createSlice({
  name: "guestOrder",
  initialState,
  reducers: {
    addGuestOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    addGuestRentalOrder: (state, action) => {
      state.rentals.push(action.payload);
    },
  },
});

export const { addGuestOrder,addGuestRentalOrder } = guestOrderSlice.actions;
export const selectGuestOrders = (state) => state.guestOrder.orders;
export const selectGuestRentalOrders = (state) => state.guestOrder.rentals;
export default persistReducer(orderPersistConfig, guestOrderSlice.reducer);