import Box from "@mui/material/Box"
import ModeSelect from "~/components/ModeSelect/ModeSelect"
import AppsIcon from "@mui/icons-material/Apps"
import { ReactComponent as TrelloLogoIcon } from "~/assets/trello.svg"
import SvgIcon from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Profile from "./Menus/Profile"
import { Link } from "react-router-dom"
import Notifications from "./Notifications/Notifications"
import AutoCompleteSearchBoard from "./SearchBoards/AutoCompleteSearchBoard"

function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
      }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/">
          <Tooltip title="Board List">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AppsIcon sx={{ color: "white" }} />
            </Box>
          </Tooltip>
        </Link>
        <Link to="/">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SvgIcon
              component={TrelloLogoIcon}
              fontSize="small"
              inheritViewBox
              sx={{ color: "white" }}
            />
            <Typography
              variant="span"
              sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
              color="white">
              Trello
            </Typography>
          </Box>
        </Link>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Search quick board */}
        <AutoCompleteSearchBoard />
        {/* Dark-light mode */}
        <ModeSelect />
        {/* Notification */}
        <Notifications />
        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
