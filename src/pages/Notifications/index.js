import React, { useEffect, useState } from "react";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
} from "../../services/notifications";

import "./styles.css";

export const Notifications = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [data, setData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async (pageToLoad = 0) => {
    try {
      setLoading(true);
      setError("");
      const [notificationsPage, unread] = await Promise.all([
        fetchNotifications({ page: pageToLoad, size: pageSize }),
        fetchUnreadCount(),
      ]);
      setData(notificationsPage);
      setUnreadCount(typeof unread === "number" ? unread : 0);
      setPage(pageToLoad);
    } catch (e) {
      setError("Não foi possível carregar as notificações no momento.");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await loadData(page);
    } catch (e) {
      setError("Não foi possível marcar a notificação como lida.");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const hasContent = data && Array.isArray(data.content) && data.content.length > 0;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notificações</h2>
        <span className="notifications-badge">
          Não lidas: <strong>{unreadCount}</strong>
        </span>
      </div>

      {loading && <p className="notifications-status">Carregando...</p>}
      {error && <p className="notifications-error">{error}</p>}

      {!loading && !hasContent && !error && (
        <p className="notifications-status">
          Nenhuma notificação encontrada até o momento.
        </p>
      )}

      {hasContent && (
        <ul className="notifications-list">
          {data.content.map((notification) => (
            <li
              key={notification.id}
              className={
                notification.read ? "notification-item read" : "notification-item unread"
              }
            >
              <div className="notification-main">
                <span className="notification-title">
                  {notification.title || "Notificação"}
                </span>
                <span className="notification-message">
                  {notification.message || notification.body || ""}
                </span>
              </div>
              <div className="notification-meta">
                <span className="notification-date">
                  {notification.sendDate || ""}
                </span>
                {!notification.read && (
                  <button
                    type="button"
                    className="notification-action"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasContent && (
        <div className="notifications-pagination">
          <button
            type="button"
            disabled={page === 0 || loading}
            onClick={() => loadData(page - 1)}
          >
            Anterior
          </button>
          <span>
            Página {page + 1} de {(data && data.totalPages) || 1}
          </span>
          <button
            type="button"
            disabled={!data || page + 1 >= data.totalPages || loading}
            onClick={() => loadData(page + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

