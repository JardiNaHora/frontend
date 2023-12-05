import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";

import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../../store/slice";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const GenerateOccurrence = () => {
  const getDate = (date) => {
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, "0"); // Garante dois dígitos para o dia
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Garante dois dígitos para o mês
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };
  registerLocale("ptBR", ptBR);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [travels, setTravels] = useState("");
  const [direction, setDirection] = useState("campusParaMetro");
  const [motivation, setMotivation] = useState("");
  const [occurrenceType, setOccurrenceType] = useState("Add Travels");
  //TODO: mudar para pegar no sistema:
  const autor = {
    nome: "Leonardo Vasconcelos",
    email: "leonardovasconcelos73@gmail.com",
  };
  const [ocorrencia, setOcorrencia] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    occurrenceType === "Add Travels"
      ? setOcorrencia({
          autor: autor,
          ocorrencia: {
            dataCriacao: getDate(new Date()),
            tipoOcorrencia: occurrenceType,
            dataInicial: getDate(startDate),
            dataFinal: getDate(endDate),
            horarioInicial: startTime,
            horarioFinal: endTime,
            viagens: travels,
            direcao: direction,
            motivacao: motivation,
          },
        })
      : setOcorrencia({
          autor: autor,
          ocorrencia: {
            dataCriacao: getDate(new Date()),
            tipoOcorrencia: occurrenceType,
            dataInicial: getDate(startDate),
            dataFinal: getDate(endDate),
            horarioInicial: startTime,
            horarioFinal: endTime,
            motivacao: motivation,
          },
        });

    console.log(ocorrencia);

    // Limpar os campos após o envio do formulário
    setStartDate("");
    setEndDate("");
    setMotivation("");
    setTravels("");
    setEndTime("");
    setStartTime("");
    setDirection("");
    setOcorrencia(null);
  };

  return (
    <div className="content">
      {isAuthenticated ? (
        <div className="container">
          <div className="body">
            <h1>Registrar Ocorrência</h1>
            <label>Tipo de ocorrência</label>
            <select onChange={(e) => setOccurrenceType(e.target.value)}>
              <option value={"Add Travels"}>Adicionar viagens</option>
              <option value={"Remove Travels"}>Remover viagens</option>
            </select>
            <label htmlFor="intervalo-dias">
              Data de começo e de fim da ocorrência
            </label>
            <ReactDatePicker
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat={"dd/MM/yyyy"}
              placeholderText="dd/mm/yyyy - dd/mm/yyyy"
              // shouldCloseOnSelect={false}
              locale="ptBR"
              required
              form="ocorrencia"
            />
            <form onSubmit={handleSubmit} id="ocorrencia">
              <div>
                <label htmlFor="intervalo-horario">
                  Horário de inicio e fim:
                </label>
                <input
                  required
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={endTime}
                  required
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              {occurrenceType === "Remove Travels" ? (
                <div></div>
              ) : (
                <div className="ocorrenciaAdd">
                  <label htmlFor="sentido">Selecione o sentido: </label>
                  <select
                    required
                    onChange={(e) => setDirection(e.target.value)}
                  >
                    <option className="select" value={"campusParaMetro"}>
                      Campus → Metrô
                    </option>
                    <option className="select" value={"metroParaCampus"}>
                      Metrô → Campus
                    </option>
                  </select>
                  <label htmlFor="viagens">Número de viagens:</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={travels}
                    required
                    onChange={(e) => setTravels(e.target.value)}
                  />
                </div>
              )}

              <label htmlFor="motivacao">Motivo da ocorrência:</label>
              <textarea
                id="motivacao"
                rows="4"
                required
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              ></textarea>
              <div className="botoes">
                <input type="reset" />
                <input type="submit" value={"Gerar"} />
              </div>
            </form>
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
