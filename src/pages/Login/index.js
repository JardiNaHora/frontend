import { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import "./styles.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Função para iniciar o login com o Google
  const handleLoginWithGoogle = () => {
    // Redireciona o usuário para o endpoint de autenticação do Google no backend
    window.location.href = BACKEND_URL + "/oauth2/authorization/google";
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/usuario",
        {
          email,
          password,
        }
      );
      // O registro foi bem-sucedido
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    // Implemente a lógica de login aqui. Após o login bem-sucedido, defina o estado "authenticated" como true.
    // Você pode usar um serviço de autenticação ou verificar um token de autenticação, por exemplo.

    try {
      // Realize o login, por exemplo, enviando uma solicitação ao seu backend com as credenciais do usuário.
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username: "usuário", password: "senha" }), // Substitua por suas credenciais
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Login bem-sucedido, defina o estado "authenticated" como true.
        setAuthenticated(true);
        navigate("/home");
      } else {
        console.error("Erro no login:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  // Função para obter informações do usuário após o login bem-sucedido
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/home/auth"
      ); // Endpoint no backend para obter informações do usuário
      console.log(response);
      setUser(response.data); // Define as informações do usuário no estado
    } catch (error) {
      console.error("Erro ao obter informações do usuário", error);
    }
  };

  useEffect(() => {
    // Verifica se o usuário já está autenticado após o carregamento da página
    fetchUserInfo();
  }, []);

  return (
    <div className="login-container">
      <div className="left-container">
        <img
          src="../../assets/JardiNaHora-Icon.png"
          alt="Logo"
          className="logo"
        />
        <h1>JardiNaHora</h1>
      </div>
      <div className="right-container">
        <h2 className="titulo">
          {isRegistering
            ? "Registrar"
            : isForgotPassword
            ? "Esqueci minha senha"
            : "Login"}
        </h2>
        {error && <div className="error-message">{error}</div>}
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isRegistering ? (
          <button onClick={handleRegister}>Registrar</button>
        ) : isForgotPassword ? (
          <button>Redefinir Senha</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
        {!isRegistering && !isForgotPassword && (
          <p>
            Ainda não possui uma conta?{" "}
            <span onClick={() => setIsRegistering(true)}>Registrar</span>
          </p>
        )}
        {!isForgotPassword && (
          <p>
            Esqueceu sua senha?{" "}
            <span onClick={() => setIsForgotPassword(true)}>
              Esqueci minha senha
            </span>
          </p>
        )}
        {(isRegistering || isForgotPassword) && (
          <p>
            Já possui uma conta?{" "}
            <span
              onClick={() => {
                setIsRegistering(false);
                setIsForgotPassword(false);
              }}
            >
              Logar
            </span>
          </p>
        )}
        {/* Botão para fazer login com o Google */}
        <button onClick={handleLoginWithGoogle}>Logar com o Google</button>
      </div>
    </div>

    /////
  );
};
