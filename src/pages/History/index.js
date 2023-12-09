import React, { useState, useEffect } from "react";
import axios from "axios";

import CardLista from "../../components/Card";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const History = () => {
  registerLocale("ptBR", ptBR);

  //dado mocado
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
  const [date, setDate] = useState(null);

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

  return (
    <div className="content">
      {isAuthenticated ? (
        <div className="container">
          <h1>Histórico de Viagens</h1>
          <div className="input-data">
            <ReactDatePicker
              className="rdp"
              selected={date}
              onChange={(date) => setDate(date)}
              placeholderText="Selecione o mês e ano"
              dateFormat="MM/yyyy"
              showMonthYearPicker
              locale="ptBR"
            />
          </div>

          {date ? (
            <div className="historicoContainer">
              <CardLista dados={viagens} />
            </div>
          ) : null}
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
