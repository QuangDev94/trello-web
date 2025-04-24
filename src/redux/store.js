// state management tool

import { configureStore } from "@reduxjs/toolkit"
import activeBoardReducer from "./features/activeBoardSlice"
import userReducer from "./features/userSlice"

export const store = configureStore({
  reducer: { activeBoard: activeBoardReducer, user: userReducer },
})
