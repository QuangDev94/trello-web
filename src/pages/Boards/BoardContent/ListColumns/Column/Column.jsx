/* eslint-disable react/prop-types */
import React, { useState } from "react"
import { toast } from "react-toastify"
import Box from "@mui/material/Box"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import DragHandleIcon from "@mui/icons-material/DragHandle"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Tooltip from "@mui/material/Tooltip"
import AddCardIcon from "@mui/icons-material/AddCard"
import Button from "@mui/material/Button"
import ListCards from "./ListCards/ListCards"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TextField from "@mui/material/TextField"
import CloseIcon from "@mui/icons-material/Close"
import { useConfirm } from "material-ui-confirm"
import { cloneDeep } from "lodash"
import { useDispatch, useSelector } from "react-redux"
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from "~/redux/features/activeBoardSlice"
import {
  createCardAPI,
  deleteColumnAPI,
  updateColumnDetailsAPI,
} from "~/assets/apis"
import ToggleFocusInput from "~/components/Form/ToggleFocusInput"

const Column = ({ column }) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } })

  const dndKitColumnStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const confirmDeleteColumn = useConfirm()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column?.cards

  // Create new card logic
  const [isOpenCreateNewCardForm, setIsOpenCreateNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const callAPICreateNewCard = async () => {
    if (!newCardTitle) {
      toast.error("Please enter card title", { position: "top-left" })
      return
    }
    // call Api
    const newCard = await createCardAPI({
      title: newCardTitle,
      columnId: column._id,
      boardId: board._id,
    })
    // Update state
    const newBoard = cloneDeep(board)
    const updatedColumn = newBoard.columns.find(
      (column) => column._id === newCard.columnId,
    )
    if (updatedColumn) {
      if (updatedColumn.cards.some((card) => card.FE_PlaceholderCard)) {
        updatedColumn.cards = [newCard]
        updatedColumn.cardOrderIds = [newCard._id]
      } else {
        updatedColumn.cards.push(newCard)
        updatedColumn.cardOrderIds.push(newCard._id)
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    // close form and clear value
    setNewCardTitle("")
    setIsOpenCreateNewCardForm(false)
  }

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: `Delete "${column.title}" ?`,
      description:
        "This action will permanently delete your column and its Cards! Are you sure?",
      confirmationText: "Confirm",
      confirmationButtonProps: { color: "error" },
    })
      .then(() => {
        // updata state board
        const newBoard = cloneDeep(board)
        newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (id) => id !== column._id,
        )
        dispatch(updateCurrentActiveBoard(newBoard))
        // call API
        deleteColumnAPI(column._id).then((res) => {
          toast.success(res?.deleteResult)
        })
      })
      .catch(() => {})
  }

  const onUpdateColumnTitle = (newTitle) => {
    // call api
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      // handle data board in Redux
      const newBoard = cloneDeep(board)
      const columnUpdate = newBoard.columns.find((c) => c._id === column._id)
      if (columnUpdate) {
        columnUpdate.title = newTitle
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }
  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          maxWidth: 300,
          minWidth: 300,
          ml: 2,
          borderRadius: "6px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}>
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <ToggleFocusInput
            initialValue={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-dnd="true"
          />
          <Box>
            <Tooltip title="more option">
              <ExpandMoreIcon
                sx={{ color: "text.primary", cursor: "pointer" }}
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-dropdown",
              }}>
              <MenuItem
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .add-card-icon": { color: "success.light" },
                  },
                }}
                onClick={() => setIsOpenCreateNewCardForm(true)}>
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .delete-forever-icon": { color: "warning.dark" },
                  },
                }}
                onClick={handleDeleteColumn}>
                <ListItemIcon>
                  <DeleteForeverIcon
                    className="delete-forever-icon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <ListCards cards={orderedCards} />

        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}>
          {isOpenCreateNewCardForm ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                height: "100%",
              }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                autoFocus
                data-no-dnd="true"
                variant="outlined"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-input": {
                      borderRadius: 1,
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  className="interceptor-loading"
                  variant="contained"
                  size="small"
                  color="success"
                  data-no-dnd="true"
                  sx={{
                    boxShadow: "none",
                    border: "0.5 solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                  onClick={callAPICreateNewCard}>
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  data-no-dnd="true"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpenCreateNewCardForm(false)}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "100%",
              }}>
              <Button
                startIcon={<AddCardIcon />}
                onClick={() => setIsOpenCreateNewCardForm(true)}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
