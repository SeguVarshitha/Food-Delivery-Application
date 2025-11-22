import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { StoreContextProvider } from "./context/StoreContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID =
  "776825484594-3mnnhvoklubkc1m840d1qq7dfn1i0fl7.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </StoreContextProvider>
  </BrowserRouter>
);
