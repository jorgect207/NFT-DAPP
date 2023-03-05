import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MoralisProvider initializeOnMount={false}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </MoralisProvider>
);
