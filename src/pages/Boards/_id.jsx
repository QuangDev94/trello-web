import { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
import { mockData } from "~/assets/apis/mock-data"
import { fetchBoardDetailsAPI } from "~/assets/apis"

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = "67f33b0b53427a8ea6338637"
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [])

  console.log("board: ", board)
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
    </Container>
  )
}

export default Board
