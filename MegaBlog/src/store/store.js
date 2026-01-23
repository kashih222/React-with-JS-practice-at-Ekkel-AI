import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { postsApi } from "./features/postsApiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
});

export default store;
