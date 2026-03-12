import api from './api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

class AuthService {
  login() {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  }

  fetchUser() {
    const response = api.get('/home/auth');
    console.log(response);
    return response;
  }
}

export default new AuthService();