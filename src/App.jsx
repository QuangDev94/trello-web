import { useColorScheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness"
import Container from "@mui/material/Container"

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    setMode(event.target.value)
  }
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="dark-mode-select-label">Mode</InputLabel>
      <Select
        labelId="dark-mode-select-label"
        id="dark-mode-select"
        value={mode}
        label="Mode"
        onChange={handleChange}>
        <MenuItem value="light">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LightModeIcon fontSize="small" />
            Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
            <DarkModeOutlinedIcon fontSize="small" />
            Dark
          </div>
        </MenuItem>
        <MenuItem value="system">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
            <SettingsBrightnessIcon fontSize="small" />
            System
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
function App() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
        <Box
          sx={{
            backgroundColor: "primary.light",
            height: (theme) => theme.trello.appBarHeight,
            display: "flex",
            alignItems: "center",
          }}>
          <ModeToggle />
        </Box>
        <Box
          sx={{
            backgroundColor: "primary.dark",
            height: (theme) => theme.trello.boardBarHeight,
            display: "flex",
            alignItems: "center",
          }}>
          Board Bar
        </Box>
        <Box
          sx={{
            backgroundColor: "primary.main",
            height: (theme) =>
              `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
            display: "flex",
            alignItems: "center",
          }}>
          Board Content
        </Box>
      </Container>
    </>
  )
}

export default App
