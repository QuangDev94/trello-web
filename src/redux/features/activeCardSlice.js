import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
}

export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHideCurrentActiveCard: (state) => {
      state.isShowModalActiveCard = false
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
export const {
  showModalActiveCard,
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
} = activeCardSlice.actions
// selector state
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}
// save in store
export const activeCardReducer = activeCardSlice.reducer
