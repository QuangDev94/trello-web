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
} from "~/assets/apis"

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = "67f33b0b53427a8ea6338637"
    fetchBoardDetailsAPI(boardId).then((board) => {
      // xử lý kéo thả card trong 1 column rỗng
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
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
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
