import React from "react"
import Box from "@mui/material/Box"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import ListItemIcon from "@mui/material/ListItemIcon"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"

import Logout from "@mui/icons-material/Logout"
import { useDispatch, useSelector } from "react-redux"
import {
  logoutUserApiThunk,
  selectCurrentUser,
} from "~/redux/features/userSlice"
import { useConfirm } from "material-ui-confirm"
import { Link } from "react-router-dom"

const Profile = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: "Log out your account now?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        dispatch(logoutUserApiThunk())
      })
      .catch(() => {})
  }
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}>
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="QuangNguyenDev"
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profile",
        }}>
        <Link to="/settings/account" style={{ color: "inherit" }}>
          <MenuItem
            onClick={handleClose}
            sx={{
              "&:hover": { color: "success.light" },
            }}>
            <Avatar
              sx={{ width: "28px", height: "28px", mr: 2 }}
              src={currentUser?.avatar}
            />{" "}
            Profile & Settings
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              color: "warning.dark",
              "& .logout-icon": { color: "warning.dark" },
            },
          }}>
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile
