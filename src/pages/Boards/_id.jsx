import { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
// import { mockData } from "~/assets/apis/mock-data"
import { generatePlaceHolderCard } from "~/utils/formatters"
import { isEmpty } from "lodash"
import {
  fetchBoardDetailsAPI,
  createColumnAPI,
  createCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from "~/assets/apis"
import { cloneDeep } from "lodash"
import { mapOrder } from "~/utils/sorts"
import { Box, CircularProgress, Typography } from "@mui/material"

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = "67f33b0b53427a8ea6338637"
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Khi F5 lại trang các columns chưa được sắp xếp đúng
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, "_id")
      // xử lý kéo thả card trong 1 column rỗng
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        } else {
          // sắp xếp cards trước khi truyền xuống component con
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id")
        }
      })
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnTitle) => {
    const newColumn = await createColumnAPI({
      title: newColumnTitle,
      boardId: board._id,
    })
    // Xử lý kéo thả card trong 1 column rỗng
    newColumn.cards = [generatePlaceHolderCard(newColumn)]
    newColumn.cardOrderIds = [generatePlaceHolderCard(newColumn)._id]
    // update state board
    const newBoard = { ...board }
    newBoard.columns.push(newColumn)
    newBoard.columnOrderIds.push(newColumn._id)
    setBoard(newBoard)
  }
  const createNewCard = async (newCardData) => {
    const newCard = await createCardAPI({
      title: newCardData.title,
      columnId: newCardData.columnId,
      boardId: board._id,
    })

    const newBoard = { ...board }
    const updatedColumn = newBoard.columns.find(
      (column) => column._id === newCard.columnId,
    )
    if (updatedColumn) {
      updatedColumn.cards.push(newCard)
      updatedColumn.cardOrderIds.push(newCard._id)
    }
    setBoard(newBoard)
  }
  const dndColumnInBoard = (updateData) => {
    // update state board
    const newBoard = { ...board }
    const dndOrderedColumnsIds = updateData.map((c) => c._id)
    newBoard.columns = updateData
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

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
    setBoard(newBoard)
    updateColumnDetailsAPI(updateData.oldColumnWhenDraggingCardId, {
      cardOrderIds: dndOrderedCardIds,
    })
  }
  console.log("board init -------", board)

  if (!board) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100vw",
          height: "100vh",
        }}>
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        dndColumnInBoard={dndColumnInBoard}
        dndCardInTheSameColumn={dndCardInTheSameColumn}
      />
    </Container>
  )
}

export default Board
