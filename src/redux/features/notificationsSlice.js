import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchInvitationsAPI, updateBoardInvitationAPI } from "~/assets/apis"

const initialState = {
  currentNotifications: null,
}

export const fetchNotificationsApiThunk = createAsyncThunk(
  "notifications/fetchNotificationsApiThunk",
  fetchInvitationsAPI,
)

export const updateBoardInvitationAPIThunk = createAsyncThunk(
  "notifications/updateBoardInvitationAPIThunk",
  updateBoardInvitationAPI,
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      state.currentNotifications.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationsApiThunk.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      state.currentNotifications = Array.isArray(incomingInvitations)
        ? incomingInvitations.reverse()
        : []
    })
    builder.addCase(
      updateBoardInvitationAPIThunk.fulfilled,
      (state, action) => {
        const incomingInvitation = action.payload
        const getInvitation = state.currentNotifications.find(
          (i) => i._id === incomingInvitation._id,
        )
        getInvitation.boardInvitation = incomingInvitation.boardInvitation
      },
    )
  },
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification,
} = notificationsSlice.actions
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}
export const notificationsReducer = notificationsSlice.reducer
