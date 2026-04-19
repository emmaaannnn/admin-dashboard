import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/base.css";
import "./shared/styles/pageTemplate.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);