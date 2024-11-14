import { configureStore } from "@reduxjs/toolkit";
import todoslice from "../slice/todoSlice.js"
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["todo"]
// };

// const persistedReducer = persistReducer(persistConfig, todoslice);

const store = configureStore({
  reducer: {
    tododata: todoslice,
  },
});

// export const persistor = persistStore(store);

export default store;