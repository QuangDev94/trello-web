import { Box, CircularProgress, Typography } from "@mui/material"

// eslint-disable-next-line react/prop-types
function PageLoadingSpinner({ caption }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        width: "100vw",
        height: "100vh",
      }}>
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner
