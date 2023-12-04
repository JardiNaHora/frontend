import React from "react";
import { Link } from "react-router-dom";

import MapIcon from "@mui/icons-material/Map";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";

import "./styles.css";
import { Close } from "@mui/icons-material";

export const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const sidebarItems = [
    {
      icon: <MapIcon className="icon" />,
      text: "Início",
      href: "/home",
    },
    {
      icon: <CalendarMonthIcon className="icon" />,
      text: "Horários",
      href: "/viagens",
    },
    {
      icon: <ContentPasteGoIcon className="icon" />,
      text: "Criar Relatório",
      href: "/relatorio-novo",
    },
    {
      icon: <ContentPasteSearchIcon className="icon" />,
      text: "Histórico Relatórios",
      href: "/relatorio-historico",
    },
    {
      icon: <ManageAccountsIcon className="icon" />,
      text: "Gerenciar Cadastro",
      href: "/alterar-cadastro",
    },
    {
      icon: <EditCalendarIcon className="icon" />,
      text: "Gerenciar Ocorrências",
      href: "/ocorrencia",
    },
    {
      icon: <NotificationsIcon className="icon" />,
      text: "Notificações",
      href: "/notificacoes",
    },
    {
      icon: <AirportShuttleIcon className="icon" />,
      text: "Veículo",
      href: "/registrar-veiculo",
    },
    {
      icon: <DepartureBoardIcon className="icon" />,
      text: "Histórico Viagens",
      href: "/historico-viagens",
    },
    {
      icon: <InfoIcon className="icon" />,
      text: "Sobre",
      href: "/sobre",
    },
    {
      icon: <LogoutIcon className="icon" />,
      text: "Logout",
    },
  ];

  const SidebarListItem = ({ icon, text, href }) => {
    if (text !== "Logout") {
      return (
        <li className="sidebar-list-item">
          <Link to={href}>
            <span onClick={OpenSidebar}>
              {icon}
              {text}
            </span>
          </Link>
        </li>
      );
    } else {
      return (
        <li className="sidebar-list-item">
          <Link
            onClick={() => {
              window.location.href = BACKEND_URL + "/logout";
            }}
          >
            {icon}
            {text}
          </Link>
        </li>
      );
    }
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          {/* <BsCart3 className="icon_header" /> SHOP */}
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          <Close />
        </span>
      </div>

      <ul className="sidebar-list">
        {sidebarItems.map((item) => (
          <SidebarListItem key={item.text} {...item} />
        ))}
      </ul>
    </aside>
  );
};
