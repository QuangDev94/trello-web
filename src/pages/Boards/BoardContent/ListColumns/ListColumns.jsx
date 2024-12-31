import Box from "@mui/material/Box"
import Column from "./Column/Column"
import Button from "@mui/material/Button"
import NoteAddIcon from "@mui/icons-material/NoteAdd"

const ListColumns = () => {
  return (
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
      <Column />
      <Column />
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
  )
}

export default ListColumns
