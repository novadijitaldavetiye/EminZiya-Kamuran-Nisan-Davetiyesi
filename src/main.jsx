import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/components.css";
import "./styles/sections.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {(window.location.pathname.replace(/\/$/, "").endsWith("/admin") || new URLSearchParams(window.location.search).has("admin")) ? <AdminDashboard /> : <App />}
  </React.StrictMode>
);