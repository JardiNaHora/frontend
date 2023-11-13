import axios from 'axios';

const API_URL = 'http://localhost:8080';

class AuthService {
  login() {
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  }

  fetchUser() {
    const response = axios.get(`${API_URL}/home/auth`, { withCredentials: true });
    console.log(response);
    return response;
  }
}

export default new AuthService();