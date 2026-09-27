import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./hotelslice";

const store = configureStore({
  reducer: {
    hotels: hotelReducer,
  },
});

export default store;