import Board from "~/pages/Boards/_id"
import { Routes, Route, Navigate } from "react-router-dom"
import NotFound from "./pages/404/NotFound"
import Auth from "./pages/Auth/Auth"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // replace true để thay thế luôn path "/" thành "/boards/67f33b0b53427a8ea6338637"
          // path "/" sẽ không nằm trong history của browser nữa
          // Dẫn đễn việc khi come back lại trang sẽ ko back lại path "/"
          // nếu ko đặt replace = true thì khi sẽ ko thể thực hiện chức năng comeback
          <Navigate to="/boards/67f33b0b53427a8ea6338637" replace={true} />
        }
      />
      <Route path="/boards/:boardId" element={<Board />} />
      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
