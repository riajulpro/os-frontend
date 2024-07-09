import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Define CartItem and CartState interfaces
interface CartItem {
  id: string;
  photo: string;
  name: string;
  rating?: number;
  price: number;
  quantity: string;
}

interface CartState {
  cart: CartItem[];
  subtotal: number;
}

interface UpdateObjectPayload {
  id: string;
  newObj: CartItem;
}

interface DeleteObjectPayload {
  id: string;
}

// Initial state
const initialState: CartState = {
  cart: [],
  subtotal: 0,
};

// Function to calculate subtotal
const calculateSubtotal = (cart: CartItem[]) =>
  cart.reduce((acc, item) => acc + item.price * parseFloat(item.quantity), 0);

// Create cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.cart.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity = String(
          Number(existingItem.quantity) + Number(newItem.quantity)
        );
      } else {
        state.cart.push(newItem);
      }

      state.subtotal = calculateSubtotal(state.cart);
    },
    updateCart: (state, action: PayloadAction<UpdateObjectPayload>) => {
      const { id, newObj } = action.payload;
      const index = state.cart.findIndex((obj) => obj.id === id);
      if (index !== -1) {
        state.cart[index] = {
          ...state.cart[index],
          ...newObj,
        };
      }

      state.subtotal = calculateSubtotal(state.cart);
    },
    deleteCart: (state, action: PayloadAction<DeleteObjectPayload>) => {
      const { id } = action.payload;
      state.cart = state.cart.filter((obj) => obj.id !== id);

      state.subtotal = calculateSubtotal(state.cart);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: string }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((obj) => obj.id === id);
      if (item) {
        item.quantity = quantity;
      }

      state.subtotal = calculateSubtotal(state.cart);
    },
    clearCart(state) {
      state.cart = [];
      state.subtotal = 0;
    },
  },
});

// Export actions and reducer
export const { addCart, updateCart, deleteCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
