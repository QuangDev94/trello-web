import Board from "~/pages/Boards/_id"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import NotFound from "./pages/404/NotFound"
import Auth from "./pages/Auth/Auth"
import AccountVerification from "./pages/Auth/AccountVerification"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "./redux/features/userSlice"

// eslint-disable-next-line react/prop-types
const ProtectedRouter = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />

  return <Outlet />
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
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
      {/* Protected Routes (Chỉ cho truy cập vào những route bên trong khi đã login) */}
      <Route element={<ProtectedRouter user={currentUser} />}>
        {/* Outlet là những child route trong Protected Routes */}
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>
      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verificaion" element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
