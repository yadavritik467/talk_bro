import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import messageSlice from "./reducer/messageReducer";
import userSlice from "./reducer/userReducer";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    message: messageSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const BACKEND_URL =  window.location.hostname === 'localhost'
? import.meta.env.VITE_API_URL
: 'http://192.168.1.17:4500';
  // import.meta.env.VITE_MODE === "dev"
  //   ? "http://192.168.1.15:4500"
  //   : import.meta.env.VITE_API_URL;
  // import.meta.env.VITE_API_URL;
