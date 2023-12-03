import React from "react";

import { AppRoutes } from "./routes/routes";
import { BrowserRouter } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="grid-container">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
