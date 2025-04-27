import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { loginUserAPI, logoutUserAPI } from "~/assets/apis"
// Khởi tạo giá trị state của 1 slice trong redux
const initialState = {
  currentUser: null,
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, ta dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserApiThunk = createAsyncThunk(
  "user/loginUserApiThunk",
  loginUserAPI,
)

export const logoutUserApiThunk = createAsyncThunk(
  "user/logoutUserApiThunk",
  logoutUserAPI,
)

export const userSlice = createSlice({
  name: "user",
  initialState,
  //   Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  //   Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserApiThunk.fulfilled, (state, action) => {
      // Get data
      const user = action.payload

      // Update state currentActiveBoard
      state.currentUser = user
    })
    builder.addCase(logoutUserApiThunk.fulfilled, (state) => {
      // API logout sau khi gọi thành công thì sẽ clear thông tin current user ở redux
      // Kết hợp với ProtectedRoutes => code sẽ điều hướng người dùng về trang loggin
      state.currentUser = null
    })
  },
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới 1 action để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// export const {} = userSlice.actions

// Selector: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export default userSlice.reducer
