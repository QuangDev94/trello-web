import { useEffect } from "react"
import Container from "@mui/material/Container"
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
// import { mockData } from "~/assets/apis/mock-data"
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/assets/apis"
import { cloneDeep } from "lodash"
import { useParams } from "react-router-dom"
// Use Redux
import {
  fetchBoardDetailsApiThunk,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from "~/redux/features/activeBoardSlice"
import { useDispatch, useSelector } from "react-redux"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard"

function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()
  // "67f33b0b53427a8ea6338637"
  useEffect(() => {
    dispatch(fetchBoardDetailsApiThunk(boardId))
  }, [dispatch, boardId])

  const dndColumnInBoard = (updateData) => {
    // update state board
    const newBoard = cloneDeep(board)
    const dndOrderedColumnsIds = updateData.map((c) => c._id)
    newBoard.columns = updateData
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const dndCardInTheSameColumn = (updateData) => {
    const newBoard = cloneDeep(board)
    const columnUpdate = newBoard.columns.find(
      (c) => c._id === updateData.oldColumnWhenDraggingCardId,
    )
    const dndOrderedCardIds = updateData.dndOrderedCards.map((c) => c._id)
    if (columnUpdate) {
      columnUpdate.cards = updateData.dndOrderedCards
      columnUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPI(updateData.oldColumnWhenDraggingCardId, {
      cardOrderIds: dndOrderedCardIds,
    })
  }

  const dndCardToTheDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns,
  ) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    dispatch(updateCurrentActiveBoard(newBoard))
    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column
    let prevCardOrderIdsUpdated = dndOrderedColumns.find(
      (c) => c._id === prevColumnId,
    )?.cardOrderIds
    if (prevCardOrderIdsUpdated[0].includes("placeholder-card"))
      prevCardOrderIdsUpdated = []
    // Gọi API
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIdsUpdated,
      nextColumnId,
      nextCardOrderIdsUpdated: dndOrderedColumns.find(
        (c) => c._id === nextColumnId,
      )?.cardOrderIds,
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board ..." />
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* Modal active card, check đóng/mở dựa theo state isShowModalActiveCard lưu trong redux*/}
      <ActiveCard />
      {/* Các thành phần còn lại trong Board detais */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        dndColumnInBoard={dndColumnInBoard}
        dndCardInTheSameColumn={dndCardInTheSameColumn}
        dndCardToTheDifferentColumn={dndCardToTheDifferentColumn}
      />
    </Container>
  )
}

export default Board
