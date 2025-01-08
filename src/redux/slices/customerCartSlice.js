import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadCustomerCartState = createAsyncThunk('customerCart/loadState', async () => {
  try {
    const serializedState = await AsyncStorage.getItem('customerCart');
    if (serializedState === null) {
      // console.log("Customer cart state is null");
      return [];
    }
    // console.log("Loaded customer cart state:", JSON.parse(serializedState));
    return JSON.parse(serializedState);
  } catch (err) {
    // console.error('Error loading customer cart:', err);
    return [];
  }
});

const saveCustomerCart = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem('customerCart', serializedState);
  } catch (err) {
    console.error('Error saving customer cart:', err);
  }
};

const customerCartSlice = createSlice({
  name: 'customerCart',
  initialState: {
    items: [],
  },
  reducers: {
    addCusCart: (state, action) => {
      const product = state.items.find(item => item.id === action.payload.id);
      const quantityToAdd = action.payload.quantity || 1; // Use specified quantity or default to 1
      if (product) {
        product.quantity += quantityToAdd;
      } else {
        state.items.push({ ...action.payload, quantity: quantityToAdd });
      }
      saveCustomerCart(state.items);
    },
    removeFromCusCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCustomerCart(state.items);
    },
    decreaseCusQuantity: (state, action) => {
      const product = state.items.find(item => item.id === action.payload);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
      saveCustomerCart(state.items);
    },
    clearCusCart: (state) => {
      state.items = [];
      saveCustomerCart(state.items);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCustomerCartState.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addCusCart, removeFromCusCart, decreaseCusQuantity, clearCusCart } = customerCartSlice.actions;
export const selectCustomerCartItems = state => state.customerCart.items;

export default customerCartSlice.reducer;
