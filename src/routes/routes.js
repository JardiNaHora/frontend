import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { History } from "../pages/History";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { ChangeRole } from "../pages/ChangeRole";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/alterar-cadastro" element={<ChangeRole />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};
