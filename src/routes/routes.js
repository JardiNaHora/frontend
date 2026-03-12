import { React, Fragment, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { History } from "../pages/History";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { NewReport } from "../pages/Report/New";
import { ReportHistory } from "../pages/Report/History";
import { ChangeRole } from "../pages/ChangeRole";
import { RegisterVehicle } from "../pages/RegisterVehicle";
import { GenerateOccurrence } from "../pages/Ocorrencia/Gerar";
import { Travels } from "../pages/Travels";
import { Notifications } from "../pages/Notifications";

export const AppRoutes = () => {
  const location = useLocation();
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const isAuthRoute =
    location.pathname === "/" || location.pathname.startsWith("/login");

  return (
    <Fragment>
      {/* Excluir Header e Sidebar nas rotas de autenticação */}
      {!isAuthRoute && (
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
        <Route path="/relatorio-criar" element={<NewReport />} />
        <Route path="/relatorio-historico" element={<ReportHistory />} />
        <Route path="/gerenciar-cadastro" element={<ChangeRole />} />
        <Route path="/registrar-veiculo" element={<RegisterVehicle />} />
        <Route path="/ocorrencia" element={<GenerateOccurrence />} />
        <Route path="/viagens" element={<Travels />} />
        <Route path="/notificacoes" element={<Notifications />} />
      </Routes>
    </Fragment>
  );
};
