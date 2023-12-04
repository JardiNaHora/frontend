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

  // Para busca no banco de dados usar uma logica parecida com essa
  // function Viagens(viagens, dataBusca) {
  //   const viagensFiltradas = viagens.filter((viagem) => {
  //     const dataViagem = new Date(viagem.data);
  //     const anoViagem = dataViagem.getFullYear();
  //     const mesViagem = dataViagem.getMonth() + 1;
  //     return (
  //       anoViagem.toString() === dataBusca.getFullYear() &&
  //       mesViagem.toString() === dataBusca.getMonth() + 1
  //     );
  //   });
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
            <div className="DataBusca">
              <ReactDatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                placeholderText="Selecione o mês e ano"
                dateFormat="MM/yyyy"
                showMonthYearPicker
                locale="ptBR"
              />
            </div>
            <div className="historicoContainer">
              {date ? <CardLista dados={viagens} /> : null}
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
