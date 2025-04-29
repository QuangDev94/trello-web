import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "~/App.jsx"
import GlobalStyles from "@mui/material/GlobalStyles"
import CssBaseline from "@mui/material/CssBaseline"
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles"
import theme from "~/theme"
// config react-toastify
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.min.css"

// config confirm provide
import { ConfirmProvider } from "material-ui-confirm"

// config redux
import { Provider } from "react-redux"
import { store } from "./redux/store"

// config react-router-dom with BrowserRouter
import { BrowserRouter } from "react-router-dom"

// config Redux-persist
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
const persistor = persistStore(store)

// Kĩ thuật Inject Store
import { injectStore } from "./utils/authorizeAxios"
injectStore(store)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <CssVarsProvider theme={theme}>
            <ConfirmProvider>
              <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
              <CssBaseline />
              <App />
              <ToastContainer position="bottom-left" />
            </ConfirmProvider>
          </CssVarsProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
