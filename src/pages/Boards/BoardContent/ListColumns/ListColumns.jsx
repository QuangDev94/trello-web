/* eslint-disable react/prop-types */
import Box from "@mui/material/Box"
import Column from "./Column/Column"
import Button from "@mui/material/Button"
import NoteAddIcon from "@mui/icons-material/NoteAdd"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

const ListColumns = ({ columns }) => {
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
          return <Column key={column?._id} column={column} />
        })}

        <Box
          sx={{
            bgcolor: "#ffffff3d",
            height: "fit-content",
            borderRadius: "6px",
            mx: 2,
            maxWidth: 200,
            minWidth: 200,
          }}>
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
      </Box>
    </SortableContext>
  )
}

export default ListColumns
