// state management tool

import { configureStore } from "@reduxjs/toolkit"
import activeBoardReducer from "./features/activeBoardSlice"
import userReducer from "./features/userSlice"

import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { activeCardReducer } from "./features/activeCardSlice"
import { notificationsReducer } from "./features/notificationsSlice"

// Cấu hình persist
const rootPersistConfig = {
  // key của persist do ta chỉ định
  key: "root",
  // Biến storage ở trên - lưu vào localstorage
  storage: storage,
  // Định nghĩa các slice dữ liệu được phép duy trì qua mỗi lần F5 trình duyệt
  whitelist: ["user"],
  // blackList: ["activeBoard"],
}
// Combine các reduces trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
})

// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
