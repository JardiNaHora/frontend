import { React, Fragment, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { History } from "../pages/History";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { NewReport } from "../pages/Report/New";
import { ReportHistory } from "../pages/Report/History";
import { ChangeRole } from "../pages/ChangeRole";
import { RegisterVehicle } from "../pages/RegisterVehicle";

export const AppRoutes = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Fragment>
      {/* Exclude Header and Sidebar for Login route */}
      {window.location.pathname !== "/login" &&
        window.location.pathname !== "/" && (
          <>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar
              openSidebarToggle={openSidebarToggle}
              OpenSidebar={OpenSidebar}
            />
          </>
        )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/historico-viagens" element={<History />} />
        <Route path="/relatorio-novo" element={<NewReport />} />
        <Route path="/relatorio-historico" element={<ReportHistory />} />
        <Route path="/alterar-cadastro" element={<ChangeRole />} />
        <Route path="/registrar-veiculo" element={<RegisterVehicle />} />
      </Routes>
    </Fragment>
  );
};
