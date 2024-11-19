import Button from "@mui/material/Button"
import { AccessAlarm, ThreeDRotation } from "@mui/icons-material"
import Typography from "@mui/material/Typography"
import { useColorScheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness"

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    setMode(event.target.value)
  }
  return (
    <Box sx={{ minWidth: 120 }}>
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
    </Box>
  )
}
function App() {
  return (
    <>
      <hr></hr>
      <ModeToggle />
      <hr></hr>
      <div>QuangNguyenDev</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <br></br>
      <AccessAlarm />
      <ThreeDRotation />
      <br></br>
      <Typography color="text.secondary">Test Typography</Typography>
    </>
  )
}

export default App
