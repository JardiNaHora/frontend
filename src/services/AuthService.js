import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class AuthService {
  login() {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  }

  fetchUser() {
    const response = axios.get(`${BACKEND_URL}/home/auth`, { withCredentials: true });
    console.log(response);
    return response;
  }
}

export default new AuthService();