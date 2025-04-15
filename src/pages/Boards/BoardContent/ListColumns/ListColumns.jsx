/* eslint-disable react/prop-types */
import { useState } from "react"
import { toast } from "react-toastify"
import Box from "@mui/material/Box"
import Column from "./Column/Column"
import Button from "@mui/material/Button"
import NoteAddIcon from "@mui/icons-material/NoteAdd"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import TextField from "@mui/material/TextField"
import CloseIcon from "@mui/icons-material/Close"

const ListColumns = ({
  columns,
  createNewColumn,
  createNewCard,
  deleteColumn,
}) => {
  const [isOpenCreateNewColumnForm, setIsOpenCreateNewColumnForm] =
    useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")

  const callAPIcreateNewColumn = () => {
    if (!newColumnTitle) {
      toast.error("Please enter column title")
      return
    }
    // call Api
    createNewColumn(newColumnTitle)
    // close form and clear value
    setNewColumnTitle("")
    setIsOpenCreateNewColumnForm(false)
  }
  return (
    <SortableContext
      items={columns.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowY: "hidden",
          overflowX: "auto",
          "&::-webkit-scrollbar-track": { m: 2 },
        }}>
        {columns?.map((column) => {
          return (
            <Column
              key={column?._id}
              column={column}
              createNewCard={createNewCard}
              deleteColumn={deleteColumn}
            />
          )
        })}
        {isOpenCreateNewColumnForm ? (
          <Box
            sx={{
              maxWidth: 250,
              minWidth: 250,
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              autoFocus
              variant="outlined"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                color="success"
                sx={{
                  boxShadow: "none",
                  border: "0.5 solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={callAPIcreateNewColumn}>
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": { color: (theme) => theme.palette.warning.light },
                }}
                onClick={() => setIsOpenCreateNewColumnForm(false)}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: "#ffffff3d",
              height: "fit-content",
              borderRadius: "6px",
              mx: 2,
              maxWidth: 250,
              minWidth: 250,
            }}
            onClick={() => setIsOpenCreateNewColumnForm(true)}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: "white",
                pl: 2.5,
                py: 1,
                justifyContent: "flex-start",
                width: "100%",
              }}>
              Add new column
            </Button>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
