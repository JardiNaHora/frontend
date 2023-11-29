import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ChangeRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [email, setEmail] = useState("");
  const [driver, setDriver] = useState(null);
  const [userFound, setUserFound] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/home/auth", { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (
          response.data.auth.details.sessionId &&
          response.data.auth.authorities[0].authority === "USER"
        ) {
          dispatch(setAuthenticated(true));
        } else {
          dispatch(setAuthenticated(false));
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao obter informações de autenticação do usuário",
          error
        );
      });
  }, [dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(BACKEND_URL + `/api/check-register/${email}`, { withCredentials: true })
      .then((response) => {
        console.log("email", response);
        if (response.data) {
          setDriver({
            nomeCompleto: response.data.username,
            email: response.data.username,
            // foto: "foto.png",
          });
          setUserFound(true);
        }
      })
      .catch((error) => {
        console.error("Usuário não cadastrado!", error);
        setUserFound(false);
      });
  };

  const logout = async () => {
    // Redireciona o usuário para o endpoint de autenticação do Google no backend
    window.location.href = BACKEND_URL + "/logout";
  };

  const updateUserRole = () => {
    axios
      .post(BACKEND_URL + `/user/${email}/${userRole}`, {
        email: email,
        role: userRole
      },
      {withCredentials: true})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Não foi possível alterar a função do usuário!", error);
      });
  }

  return (
    <div>
      {isAuthenticated ? (
        <div className="container">
          <div className="header">
            <button
              onClick={() => {
                window.location.href = BACKEND_URL + "/logout";
              }}
            >
              sair
            </button>
          </div>
          <div className="body">
            <h1>Alterar Cadastro</h1>
            <form onSubmit={handleSubmit} id="buscar-email">
              <input
                type="email"
                id="email"
                placeholder="exemplo@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="botoes">
                <input type="reset" value={"Limpar"} />
                <input type="submit" value={"Buscar"} />
              </div>
            </form>
            <hr className="linha-horizontal" />

            {userFound ? (
              <div className="dados-adicionais">
                <label htmlFor="nome">Nome Completo:</label>
                <input
                  type="text"
                  id="nome"
                  value={driver.nomeCompleto}
                  readOnly
                />
                <label htmlFor="email-info">E-mail:</label>
                <input
                  type="text"
                  id="email-info"
                  value={driver.email}
                  readOnly
                />
                <img
                  src={"frontend/src/pages/ChangeRole/foto.png"}
                  alt="Imagem do usuário"
                />
                <label htmlFor="tipo-usuario">Tipo de Usuário:</label>
                <select
                  id="tipo-usuario"
                  onChange={(e) => setUserRole(e.target.value)}
                  required
                >
                  <option value="USER">Usuário</option>
                  <option value="DRIVER">Motorista</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <input type="submit" value="Salvar" onClick={updateUserRole}/>
              </div>
            ) : (
              <h4>Usuário não encontrado</h4>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            window.location.href = BACKEND_URL + "/oauth2/authorization/google";
          }}
        >
          Logar com o Google
        </button>
      )}
    </div>
  );
};
