// state management tool

import { configureStore } from "@reduxjs/toolkit"
import activeBoardReducer from "./features/activeBoardSlice"
export const store = configureStore({
  reducer: { activeBoard: activeBoardReducer },
})
