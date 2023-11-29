import React, { useState, useEffect } from "react";
import axios from "axios";

import CardLista from "../../../components/Card";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const History = () => {
  const viagens = [
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
  ];
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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

  const handleAnoChange = (event) => {
    event.preventDefault();
    setAnoSelecionado(event.target.value);
  };

  const handleMesChange = (event) => {
    event.preventDefault();
    setMesSelecionado(event.target.value);
  };

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
            <label>
              Selecione aqui o histórico de viagens do mês e ano desejado:
            </label>

            <select
              id="selectAno"
              name="ano"
              onChange={handleAnoChange}
              value={anoSelecionado}
            >
              <option value="">Ano</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <select
              id="selectMes"
              name="mes"
              onChange={handleMesChange}
              value={mesSelecionado}
            >
              <option value="">Mês</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>

            <div className="historicoContainer">
              <CardLista dados={viagens} />
            </div>
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
