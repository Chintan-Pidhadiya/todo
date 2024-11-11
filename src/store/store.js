import { configureStore } from "@reduxjs/toolkit";
import todoslice from "../slice/todoSlice";

// const storage = require("redux-persist/lib/storage");
// const { persistReducer, persistStore } = require("redux-persist");

const store = configureStore({
  reducer: {
    tododata: todoslice,
  },
});


export default store;