import api from './api';

export async function registerDeviceToken(token, options = {}) {
  const payload = {
    token,
    deviceType: options.deviceType || 'WEB',
    deviceId: options.deviceId || 'web-browser',
    latitude: options.latitude ?? null,
    longitude: options.longitude ?? null,
    notificationEnabled: options.notificationEnabled ?? true,
  };

  const response = await api.post('/api/notifications/device-token', payload);
  return response.data;
}

export async function updateUserLocation(latitude, longitude) {
  const response = await api.put(
    '/api/notifications/user-location',
    null,
    { params: { latitude, longitude } },
  );
  return response.data;
}

export async function fetchNotifications(params = {}) {
  const response = await api.get('/api/notifications', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
  });
  return response.data;
}

export async function fetchUnreadCount() {
  const response = await api.get('/api/notifications/unread-count');
  return response.data;
}

export async function markNotificationAsRead(id) {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
}

