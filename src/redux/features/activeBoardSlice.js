import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { isEmpty } from "lodash"
import { fetchBoardDetailsAPI } from "~/assets/apis"
import { generatePlaceHolderCard } from "~/utils/formatters"
import { mapOrder } from "~/utils/sorts"

// Khởi tạo giá trị state của 1 slice trong redux
const initialState = {
  currentActiveBoard: null,
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, ta dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsApiThunk = createAsyncThunk(
  "activeBoard/fetchBoardDetailsApiThunk",
  fetchBoardDetailsAPI,
)

export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  //   Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Get data
      const fullBoard = action.payload

      // handle or transform data
      //       ...

      // Update state currentActiveBoard
      state.currentActiveBoard = fullBoard
    },
    updateCardInBoard: (state, action) => {
      // update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incommingCard = action.payload
      const column = state.currentActiveBoard.columns.find(
        (c) => c._id === incommingCard.columnId,
      )
      if (column) {
        const card = column.cards.find((c) => c._id === incommingCard._id)
        if (card) {
          Object.keys(incommingCard).forEach((key) => {
            card[key] = incommingCard[key]
          })
        }
      }
    },
  },
  //   Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsApiThunk.fulfilled, (state, action) => {
      // Get data
      const fullBoard = action.payload
      // Thành viên trong board sẽ là gộp lại của 2 mảng owners và members
      fullBoard.FE_allUsers = fullBoard.owners.concat(fullBoard.members)
      // handle or transform data
      fullBoard.columns = mapOrder(
        fullBoard?.columns,
        fullBoard?.columnOrderIds,
        "_id",
      )
      // xử lý kéo thả card trong 1 column rỗng
      fullBoard.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        } else {
          // sắp xếp cards trước khi truyền xuống component con
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id")
        }
      })

      // Update state currentActiveBoard
      state.currentActiveBoard = fullBoard
    })
  },
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới 1 action để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions

// Selector: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export default activeBoardSlice.reducer
