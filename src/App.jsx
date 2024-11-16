import Button from "@mui/material/Button"
import { AccessAlarm, ThreeDRotation } from "@mui/icons-material"
import Typography from "@mui/material/Typography"
function App() {
  return (
    <>
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
