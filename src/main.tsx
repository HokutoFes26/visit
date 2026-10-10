import App from "@/App";
import { Provider } from "@/provider";
import "@/styles/globals.css";
import "@/styles/monochrome.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Provider>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
);
