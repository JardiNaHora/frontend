import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../../store/slice";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const NewReport = () => {
  //recebendo o dia de hoje
  const date = new Date();
  // Obtendo dia, mês e ano
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mês começa do zero, então é necessário adicionar 1
  const year = date.getFullYear();
  // Criando a string no formato desejado
  const formattedDate = `${day}/${month}/${year}`;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
            <React.Fragment>
              <h1>Gerar Relatorio</h1>
              <div className="datas">
                <div className="data data-inicio">
                  <label htmlFor="start">Data de inicio: </label>
                  <DatePicker
                    className="date-picker"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat={"dd/MM/yyyy"}
                    placeholderText="dd/mm/aaaa"
                    // shouldCloseOnSelect={false}
                    locale="pt-BR"
                    required
                    form="relatorio"
                  />
                </div>
                <div className="data data-fim">
                  <label htmlFor="end">Data de fim: </label>
                  <DatePicker
                    className="date-picker"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat={"dd/MM/yyyy"}
                    placeholderText="dd/mm/aaaa"
                    // shouldCloseOnSelect={false}
                    locale="pt-BR"
                    required
                    form="relatorio"
                  />
                </div>
              </div>
              <form id="relatorio">
                <label htmlFor="obs">Observação:</label>
                <textarea id="obs" placeholder="Opcional" rows="4"></textarea>
                <div className="botoes">
                  <input type="reset" />
                  <input type="submit" />
                </div>
              </form>
            </React.Fragment>
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
