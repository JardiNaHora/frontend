import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import axios from 'axios';

import './styles.css';

const firebaseConfig = {
  apiKey: "AIzaSyBv7M0cKyq-IeSWpSos2b4jF-1jIikprKc",
  authDomain: "projeto-jardineira.firebaseapp.com",
  projectId: "projeto-jardineira",
  storageBucket: "projeto-jardineira.appspot.com",
  messagingSenderId: "540401877071",
  appId: "1:540401877071:web:d337dec96bd43eb573aa3a"
};

const app = initializeApp(firebaseConfig);

export const Login = () => {
  const { signInGoogle, signed } = useContext(AuthGoogleContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  async function handleLoginFromGoogle() {
    const result = await signInGoogle();
    
    if (result) {
      const user = result.users[0];
      
      const data = {
        nome: user.displayName,
        email: user.email,
        senha: 'senha-aleatoria' // substitua por uma senha adequada
      };
      
      try {
        await axios.post('http://localhost:8080/usuario', data);
        // O usuário foi cadastrado com sucesso no banco de dados
      } catch (error) {
        console.error('Erro ao cadastrar o usuário no banco de dados', error);
      }
    }
  }
  
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/usuario', { email, password });
      // O registro foi bem-sucedido
    } catch (error) {
      setError(error.message);
    }
  };
  
  

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8080/usuario/d0dd1bb5-72db-4124-bb84-d5952270146e');
      if (response.data.password === password) {
        // O login foi bem-sucedido
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await app.auth().sendPasswordResetEmail(email);
      alert("Um email de redefinição de senha foi enviado para o seu endereço de email.");
    } catch (error) {
      setError(error.message);
    }
  };

  if (signed) {
    return <Navigate to="/Home" />;
  }

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Registrar" : isForgotPassword ? "Esqueci minha senha" : "Login"}</h2>
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
        <button onClick={handleForgotPassword}>Redefinir Senha</button>
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
          <span onClick={() => setIsForgotPassword(true)}>Esqueci minha senha</span>
        </p>
      )}
      <button onClick={handleLoginFromGoogle}>Logar com o Google</button>
    </div>
  );
};