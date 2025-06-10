import { useState, useEffect } from "react"
import AppBar from "~/components/AppBar/AppBar"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from "@mui/material/Unstable_Grid2"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import { Link, useLocation } from "react-router-dom"
import SidebarCreateBoardModal from "./create"

import { styled } from "@mui/material/styles"
import { fetchBoardsAPI } from "~/assets/apis"
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants"
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: "12px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#33485D" : theme.palette.grey[300],
  },
  "&.active": {
    color: theme.palette.mode === "dark" ? "#90caf9" : "#0c66e4",
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#e9f2ff",
  },
}))

function Boards() {
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get("page") || "1", 10)
  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }
  useEffect(() => {
    // Fake tạm 16 cái item thay cho boards
    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // setBoards([...Array(16)].map((_, i) => i))
    // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
    // setTotalBoards(100)

    // Mỗi khi url thay đổi khi chúng ta click vào pagination item khác, thì location.search thay đổi , chạy lại useEffect, và gọi lại api với query mới
    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [location.search])

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }
  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={12} md={3} lg={3} xl={2}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal
                afterCreateNewBoard={afterCreateNewBoard}
              />
            </Stack>
          </Grid>

          <Grid
            container
            xs={12}
            sm={12}
            md={9}
            lg={9}
            xl={10}
            flexDirection="column"
            alignItems="center">
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
              Your boards:
            </Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 && (
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  textAlign: "center",
                }}>
                No result found!
              </Typography>
            )}

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 && (
              <Grid container spacing={2} width="100%">
                {boards.map((board) => (
                  <Grid xs={12} sm={6} md={6} lg={4} xl={3} key={board._id}>
                    <Card sx={{ height: "250px" }}>
                      {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
                      <CardMedia
                        component="img"
                        height="100"
                        image="https://picsum.photos/100"
                      />
                      {/* <Box
                        sx={{
                          height: "50px",
                          backgroundColor: randomColor(),
                        }}></Box> */}

                      <CardContent
                        sx={{
                          p: 1.5,
                          "&:last-child": { p: 1.5 },
                          height: "150px",
                          display: "flex",
                          flexDirection: "column",
                        }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {board?.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            flex: 2,
                          }}>
                          {board?.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${board?._id}`}
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            color: "primary.main",
                            "&:hover": { color: "primary.light" },
                          }}>
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {totalBoards > 0 && (
              <Box
                sx={{
                  width: "100%",
                  my: 3,
                  pr: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page
                  // (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${
                        item.page === DEFAULT_PAGE ? "" : `?page=${item.page}`
                      }`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
