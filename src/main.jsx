import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "~/App.jsx"
import CssBaseline from "@mui/material/CssBaseline"
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles"
import theme from "~/theme"
// config react-toastify
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.min.css"

// config confirm provide
import { ConfirmProvider } from "material-ui-confirm"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider>
        <CssBaseline />
        <App />
        <ToastContainer position="bottom-left" />
      </ConfirmProvider>
    </CssVarsProvider>
  </StrictMode>,
)
