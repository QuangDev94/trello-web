import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentActiveCard: null,
}

export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload
      state.currentActiveCard = fullCard
    },
  },
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {},
})

// các action để dispatch
export const { clearCurrentActiveCard, updateCurrentActiveCard } =
  activeCardSlice.actions
// selector state
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}
// save in store
export const activeCardReducer = activeCardSlice.reducer
