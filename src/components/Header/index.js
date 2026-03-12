import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Menu } from "@mui/icons-material";
import { Avatar } from "@mui/material";

import "./styles.css";
import AuthService from "../../services/AuthService";
import { fetchUnreadCount } from "../../services/notifications";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

export const Header = ({ OpenSidebar }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Busca informações básicas do usuário autenticado
    AuthService.fetchUser()
      .then((res) => {
        const data = res.data;
        if (data && data.username) {
          setUserName(data.username);
        }
      })
      .catch(() => {
        // silencioso em dev
      });

    // Busca contagem inicial de notificações não lidas
    const loadUnread = () => {
      fetchUnreadCount()
        .then((count) => {
          if (typeof count === "number") setUnreadCount(count);
        })
        .catch(() => {});
    };

    loadUnread();
    const intervalId = setInterval(loadUnread, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const initials = userName
    ? userName
        .split("@")[0]
        .split(/[.\s]/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("")
    : "?";

  const handleLogout = () => {
    window.location.href = `${BACKEND_URL}/logout`;
  };

  const handleMyData = () => {
    navigate("/gerenciar-cadastro");
    setMenuOpen(false);
  };

  const handleNotifications = () => {
    navigate("/notificacoes");
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <Menu className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left"></div>
      <div className="header-right">
        <div
          className="user-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <div className="avatar-wrapper">
            <Avatar alt={userName || "Usuário"}>{initials}</Avatar>
            {unreadCount > 0 && (
              <span className="avatar-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          {menuOpen && (
            <div className="user-menu-dropdown">
              <div className="user-menu-item" onClick={handleMyData}>
                Meus dados
              </div>
              <div className="user-menu-item" onClick={handleNotifications}>
                Notificações
              </div>
              <div className="user-menu-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
