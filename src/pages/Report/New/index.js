import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";

import gerarPDFReports from "../PdfMake";

import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../../store/slice";
import { useNavigate } from "react-router-dom";
import CardLista from "../../../components/Card";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const NewReport = () => {
  const getDate = (date) => {
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, "0"); // Garante dois dígitos para o dia
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Garante dois dígitos para o mês
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const [isSearched, setIsSearched] = useState(false);
  registerLocale("ptBR", ptBR);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [obs, setObs] = useState("");
  const [autor, setAutor] = useState({
    nome: "Leonardo Vasconcelos",
    email: "leonardovasconcelos73@gmail.com",
    foto: "foto",
  });
  const formulario = {
    dataCriacao: getDate(new Date()),
    dataInicial: getDate(startDate),
    dataFinal: getDate(endDate),
    obs: obs,
    autor: autor,
  };

  const [reports, setReports] = useState(null);
  const [reportToBeSaved, setReportToBeSaved] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const buscar = (e) => {
    e.preventDefault();
    setReports([
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
    ]);

    // if (reports.lenght < 1) {
    //   document.getElementById("btn-gerar-relatorio").disabled = false;
    // }
    setIsSearched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    gerarPDFReports(formulario, reports);
    setReportToBeSaved({ formulario, reports });
    console.log(reports, reportToBeSaved);
  };

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/home/auth", { withCredentials: true })
      .then((response) => {
        // console.log(response);
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
              <h1>Relatório</h1>
              <div className="datas">
                <div className="data data-inicio">
                  <label htmlFor="start">Data de inicio: </label>
                  <ReactDatePicker
                    className="date-picker"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat={"dd/MM/yyyy"}
                    placeholderText="dd/mm/aaaa"
                    // shouldCloseOnSelect={false}
                    locale="ptBR"
                    required
                    form="relatorio"
                  />
                </div>
                <div className="data data-fim">
                  <label htmlFor="end">Data de fim: </label>
                  <ReactDatePicker
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
                    locale="ptBR"
                    required
                    form="relatorio"
                  />
                </div>
              </div>
              <form onSubmit={buscar} id="relatorio">
                <label htmlFor="obs">Observação:</label>
                <textarea
                  id="obs"
                  placeholder="Opcional"
                  rows="4"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                ></textarea>
                <div className="botoes">
                  <input type="reset" />
                  <input type="submit" value={"Buscar"} />
                  <input
                    type="button"
                    id="btn-gerar-relatorio"
                    value={"Gerar Relatório"}
                    onClick={handleSubmit}
                    // disabled
                  />
                </div>
              </form>
            </React.Fragment>
            {isSearched ? <CardLista dados={reports} /> : <div></div>}
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
