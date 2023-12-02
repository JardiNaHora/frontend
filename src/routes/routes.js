import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { History } from "../pages/History";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Adm } from "../pages/Adm";
import { NewReport } from "../pages/Report/New";
import { ReportHistory } from "../pages/Report/History";
import { ChangeRole } from "../pages/ChangeRole";
import { RegisterVehicle } from "../pages/RegisterVehicle";
import { GenerateOccurrence } from "../pages/Ocorrencia/Gerar";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/histoico-viagens" element={<History />} />
          <Route path="/adm" element={<Adm />} />
          <Route path="/relatorio/novo" element={<NewReport />} />
          <Route path="/relatorio/historico" element={<ReportHistory />} />
          <Route path="/history" element={<History />} />
          <Route path="/alterar-cadastro" element={<ChangeRole />} />
          <Route path="/registrar-veiculo" element={<RegisterVehicle />} />
          <Route path="/ocorrencia/novo" element={<GenerateOccurrence />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};
