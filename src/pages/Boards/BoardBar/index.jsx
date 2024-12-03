import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import DashboardIcon from "@mui/icons-material/Dashboard"
import VpnLockIcon from "@mui/icons-material/VpnLock"
import AddToDriveIcon from "@mui/icons-material/AddToDrive"
import BoltIcon from "@mui/icons-material/Bolt"
import FilterListIcon from "@mui/icons-material/FilterList"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import { Tooltip } from "@mui/material"
import Button from "@mui/material/Button"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
const MENU_STYLE = {
  color: "primary.main",
  backgroundColor: "white",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: "primary.main",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
}

function BoardBar() {
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
        borderTop: "1px solid #00bfa5",
      }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          icon={<DashboardIcon />}
          label="QuangNguyen DEV"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<VpnLockIcon />}
          label="Public/Private workspace"
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
        <Button variant="outlined" startIcon={<PersonAddIcon />}>
          Create
        </Button>

        <AvatarGroup
          max={4}
          sx={{
            "& .MuiAvatar-root": {
              width: 30,
              height: 30,
              fontSize: 16,
            },
          }}>
          <Tooltip title="QuangNguyenDev">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="QuangNguyenDev">
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </Tooltip>
          <Tooltip title="QuangNguyenDev">
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </Tooltip>
          <Tooltip title="QuangNguyenDev">
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          </Tooltip>
          <Tooltip title="QuangNguyenDev">
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
