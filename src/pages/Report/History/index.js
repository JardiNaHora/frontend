import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";
import HistoryComponentMaker from "./HistoryComponentMaker";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../../store/slice";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ReportHistory = () => {
  const data = [
    {
      formulario: {
        dataCriacao: "29/11/2023",
        dataInicial: "03/11/2023",
        dataFinal: "01/11/2023",
        obs: "string feita por leonardo bla bla bla",
        autor: {
          nome: "Leonardo Vasconcelos",
          email: "leonardovasconcelos73@gmail.com",
          foto: "foto",
        },
      },
      reports: [
        {
          motorista: "Toretto",
          veiculo: "Ônibus",
          data: "22/11/2023",
          distanciaPercorrida: 55,
          numeroDeViagens: 20,
        },
        {
          motorista: "Toretto",
          veiculo: "Micro-Ônibus",
          data: "23/11/2023",
          distanciaPercorrida: 40,
          numeroDeViagens: 18,
        },
      ],
    },
    {
      formulario: {
        dataCriacao: "30/11/2023",
        dataInicial: "05/10/2023",
        dataFinal: "17/10/2023",
        obs: "string feita por leonardo bla bla bla",
        autor: {
          nome: "Paulinho Paulada",
          email: "leonardovasconcelos73@gmail.com",
          foto: "foto",
        },
      },
      reports: [
        {
          motorista: "Toretto",
          veiculo: "Ônibus",
          data: "22/11/2023",
          distanciaPercorrida: 55,
          numeroDeViagens: 20,
        },
        {
          motorista: "Toretto",
          veiculo: "Micro-Ônibus",
          data: "23/11/2023",
          distanciaPercorrida: 40,
          numeroDeViagens: 18,
        },
      ],
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [buscar, setBuscar] = useState(null);
  const [reportsList, setReportsList] = useState(data);
  const [isSearched, setIsSearched] = useState(false);

  //

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportsList(data);

    setIsSearched(true);
  };

  const handleClean = (e) => {
    e.preventDefault();
    setReportsList(null);

    setIsSearched(false);
  };

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

  const logout = async () => {
    // Redireciona o usuário para o endpoint de autenticação do Google no backend
    window.location.href = BACKEND_URL + "/logout";
  };

  return (
    <div className="content">
      {isAuthenticated ? (
        <div className="container">
          <div className="body">
            <h1>Histórico de Relatórios</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Buscar" id="buscar" />
              <div className="botoes">
                <input type="reset" onClick={handleClean} />
                <input type="submit" value="Buscar" />
              </div>
            </form>
            {isSearched ? (
              <HistoryComponentMaker dados={reportsList} />
            ) : (
              <div></div>
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
