/* eslint-disable react/prop-types */
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import DashboardIcon from "@mui/icons-material/Dashboard"
import VpnLockIcon from "@mui/icons-material/VpnLock"
import AddToDriveIcon from "@mui/icons-material/AddToDrive"
import BoltIcon from "@mui/icons-material/Bolt"
import FilterListIcon from "@mui/icons-material/FilterList"
import { Tooltip } from "@mui/material"
import { capitalizeFirstLetter } from "~/utils/formatters"
import BoardUserGroup from "./BoardUserGroup"
import InviteBoardUser from "./InviteBoardUser"
const MENU_STYLE = {
  color: "white",
  backgroundColor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
}
function BoardBar({ board }) {
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
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
      }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
            sx={MENU_STYLE}
          />
        </Tooltip>

        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          sx={MENU_STYLE}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <InviteBoardUser boardId={board._id} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
