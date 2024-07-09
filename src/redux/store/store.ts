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
import { api } from "../api/appSlice";
import authReducer from "../features/auth/auth.slice";
import cartReducer from "../features/cart/cart.slice";
import wishlistReducer from "../features/wishlist/wishlist.slice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Configure persisted reducers
const persistedCartReducer = persistReducer(
  { ...persistConfig, key: "cart" },
  cartReducer
);
const persistedAuthReducer = persistReducer(
  { ...persistConfig, key: "auth" },
  authReducer
);
const persistedWishReducer = persistReducer(
  { ...persistConfig, key: "wishlist" },
  wishlistReducer
);

// Configure store
const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    wishlist: persistedWishReducer,
    auth: persistedAuthReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// Configure persistor
const persistor = persistStore(store);

// Export types and store/persistor
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { persistor, store };
