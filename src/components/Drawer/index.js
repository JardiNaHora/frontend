import React, { useState } from "react";
import "./styles.css";

import MapIcon from "@mui/icons-material/Map";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";

export const Drawer = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [darkModeActive, setDarkModeActive] = useState(false);

  const FRONTEND_URL = "http://localhost:3000";
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode-variables");
    setDarkModeActive(!darkModeActive);
  };

  const logout = async () => {
    // Redireciona o usuário para o endpoint de autenticação do Google no backend
    window.location.href = BACKEND_URL + "/logout";
  };

  return (
    <div className={`container ${menuVisible ? "menu-visible" : ""}`}>
      <aside>
        <div className="toggle">
          <div className="close" id="close-btn" onClick={closeMenu}>
            <span className="material-icons-sharp">close</span>
          </div>
        </div>

        <div className="sidebar">
          <a href={FRONTEND_URL + "/home"} className="active">
            <span class="material-icons-sharp">
              <MapIcon />
            </span>
            <h3>Visializar o Mapa</h3>
          </a>
          <a href={FRONTEND_URL + "/relatorio/novo"}>
            <span class="material-icons-sharp">
              <ContentPasteGoIcon />
            </span>
            <h3>Novo Relatório</h3>
          </a>
          <a href={FRONTEND_URL + "/relatorio/historico"}>
            <span class="material-icons-sharp">
              <ContentPasteSearchIcon />
            </span>
            <h3>Historico de Relatórios</h3>
          </a>
          <a href={FRONTEND_URL + "/alterar-cadastro"}>
            <span class="material-icons-sharp">
              <ManageAccountsIcon />
            </span>
            <h3>Alterar Cadastro</h3>
          </a>
          <a href={FRONTEND_URL + "/notificacoes"}>
            <span class="material-icons-sharp">
              <NotificationsIcon />
            </span>
            <h3>Notificações</h3>
            <span class="message-count">27</span>
          </a>
          <a href={FRONTEND_URL + "/cadastrar-veiculo"}>
            <span class="material-icons-sharp">
              <AirportShuttleIcon />
            </span>
            <h3>Cadastrar Veículo</h3>
          </a>
          <a href={FRONTEND_URL + "/historico"}>
            <span class="material-icons-sharp">
              <DepartureBoardIcon />
            </span>
            <h3>Histórico de Viagens</h3>
          </a>

          <a href={FRONTEND_URL + "/sobre"}>
            <span class="material-icons-sharp">
              <InfoIcon />
            </span>
            <h3>Sobre</h3>
          </a>
          <a href={"#"} onClick={logout}>
            <span class="material-icons-sharp">
              <LogoutIcon />
            </span>
            <h3>Logout</h3>
          </a>
        </div>
      </aside>

      <div className="right-section">
        <div className="nav">
          <button id="menu-btn" onClick={toggleMenu}>
            <span className="material-icons-sharp">menu</span>
          </button>
          <div className="dark-mode" onClick={toggleDarkMode}>
            <span
              className={`material-icons-sharp ${
                darkModeActive ? "active" : ""
              }`}
            >
              <DarkModeIcon />
            </span>
            <span
              className={`material-icons-sharp ${
                !darkModeActive ? "active" : ""
              }`}
            >
              <LightModeIcon />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
