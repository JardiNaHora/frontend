import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";
import { startOfWeek, addDays, subDays, format } from "date-fns";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Travels = () => {
  const getDate = (date) => {
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, "0"); // Garante dois dígitos para o dia
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Garante dois dígitos para o mês
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const defaultData = [
    {
      horarioInicio: "07:00",
      horarioFinal: "08:00",
      viagens: 4,
      sentido: "metroParaCampus",
    },
    {
      horarioInicio: "09:45",
      horarioFinal: "09:55",
      viagens: 1,
      sentido: "campusParaMetro",
    },
    {
      horarioInicio: "11:45",
      horarioFinal: "12:20",
      viagens: 4,
      sentido: "campusParaMetro",
    },
    {
      horarioInicio: "13:00",
      horarioFinal: "13:40",
      viagens: 3,
      sentido: "metroParaCampus",
    },
    {
      horarioInicio: "15:30",
      horarioFinal: "16:00",
      viagens: 3,
      sentido: "campusParaMetro",
    },
    {
      horarioInicio: "17:30",
      horarioFinal: "18:05",
      viagens: 3,
      sentido: "campusParaMetro",
    },
    {
      horarioInicio: "18:20",
      horarioFinal: "18:40",
      viagens: 2,
      sentido: "metroParaCampus",
    },
    {
      horarioInicio: "20:10",
      horarioFinal: "20:20",
      viagens: 1,
      sentido: "campusParaMetro",
    },
    {
      horarioInicio: "21:45",
      horarioFinal: "21:55",
      viagens: 1,
      sentido: "campusParaMetro",
    },
  ];
  const ocorrenciasEspeciais = [
    {
      tipoOcorrencia: "adicionar viagens", // teste adicionar entre horarios existentes
      dataInicial: "03/12/2023",
      dataFinal: "06/12/2023",
      horarioInicio: "20:15",
      horarioFinal: "20:30",
      viagens: 15,
      sentido: "campusParaMetro",
    },
    {
      tipoOcorrencia: "adicionar viagens", // teste de adicionar solto
      dataInicial: "03/12/2023",
      dataFinal: "03/12/2023",
      horarioInicio: "22:35",
      horarioFinal: "22:45",
      viagens: 1,
      sentido: "campusParaMetro",
    },
    {
      tipoOcorrencia: "remover viagens", // teste remocao
      dataInicial: "03/12/2023",
      dataFinal: "03/12/2023",
      horarioInicio: "07:00",
      horarioFinal: "09:50",
    },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const [tableData, setTableData] = useState([]);

  const [weekDaysWithHorarios, setWeekDaysWithHorarios] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // função que muda o formato da data em yyyy/MM/dd para que seja possivel comparar datas precisamente
  const parseData = (data) => {
    var partesData = data.split("/");
    return new Date(partesData[2], partesData[1] - 1, partesData[0]);
  };
  function getWeekDays(date) {
    // Obter o início da semana (domingo) para a data fornecida ou a data atual se não for fornecida
    const startOfCurrentWeek = startOfWeek(date || new Date());

    // Array para armazenar os 7 dias da semana
    const days = [];

    // Mapeamento correto dos dias da semana
    const dayName = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    // Adicionar os dias da semana ao array
    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfCurrentWeek, i);
      // Formatando a data para o formato desejado (você pode ajustar conforme necessário)
      const formattedDate = format(day, "yyyy/MM/dd");
      // Adicionando o objeto ao array
      days.push({ dayOfWeek: i, dayName: dayName[i], date: formattedDate });
    }

    return days;
  }

  const applySpecialOccurrences = (data, horarios) => {
    ocorrenciasEspeciais.forEach((ocorrencia) => {
      const {
        tipoOcorrencia,
        dataInicial,
        dataFinal,
        horarioInicio,
        horarioFinal,
        viagens,
        sentido,
      } = ocorrencia;

      // verifica a data da ocorrencia e coloca entre os dias na tabela
      if (
        data >= new Date(parseData(dataInicial)) &&
        data <= new Date(parseData(dataFinal))
      ) {
        if (tipoOcorrencia === "adicionar viagens") {
          const existingTravel = horarios.find(
            (travel) =>
              (travel.horarioInicio <= horarioInicio &&
                travel.horarioFinal >= horarioInicio) ||
              (travel.horarioInicio <= horarioFinal &&
                travel.horarioFinal >= horarioFinal)
          );

          // adicionar viagens entre horarios existentes
          if (existingTravel) {
            // Crie uma cópia do objeto para evitar modificar a referência original
            const modifiedTravel = { ...existingTravel };

            modifiedTravel.viagens += viagens;

            // ajustando os horarios para nao bagunçar a tabela
            if (modifiedTravel.horarioInicio <= horarioInicio) {
              modifiedTravel.horarioFinal = horarioFinal;
            } else {
              modifiedTravel.horarioInicio = horarioInicio;
            }

            // Encontre o índice do objeto existente e substitua-o pela cópia modificada
            const index = horarios.indexOf(existingTravel);
            horarios[index] = modifiedTravel;
          } else {
            // Se não houver, adiciona uma nova viagem no horário especificado
            horarios.push({
              horarioInicio,
              horarioFinal,
              viagens,
              sentido,
            });
          }
        } else if (tipoOcorrencia === "remover viagens") {
          horarios.forEach((horario) => {
            if (
              horarios.length > 0 &&
              formatTime(horario.horarioInicio) >= formatTime(horarioInicio) &&
              formatTime(horario.horarioFinal) <= formatTime(horarioFinal)
            ) {
              horario.viagens = 0;
            }
          });
        }
      }
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const applyOccurrencesToWeekDays = () => {
    const updatedWeekDays = getWeekDays(currentDate).map((dia) => {
      const horarios =
        dia.dayOfWeek === 0 || dia.dayOfWeek === 6 ? [] : [...defaultData];

      const data = { ...dia, horarios };
      applySpecialOccurrences(new Date(dia.date), data.horarios);
      return data;
    });

    setWeekDaysWithHorarios(updatedWeekDays);
  };

  const handlePrevWeek = () => {
    setCurrentDate(subDays(new Date(), 7));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(new Date(), 7));
  };

  useEffect(() => {
    // Esta função será executada sempre que a data atual for alterada
    applyOccurrencesToWeekDays();
    // Dependência: currentDate - Esta função será executada sempre que a data atual for alterada
  }, [currentDate]);

  const renderTable = () => {
    // Obter todos os horários únicos presentes em weekDaysWithHorarios
    const uniqueHorarios = Array.from(
      new Set(
        weekDaysWithHorarios.reduce(
          (horarios, dia) =>
            horarios.concat(
              dia.horarios.map((horario) => horario.horarioInicio)
            ),
          []
        )
      )
    ).sort();

    return (
      <table>
        <thead>
          <tr>
            {weekDaysWithHorarios.map((dia) => (
              <th key={dia.date}>
                <div>
                  <p>{format(new Date(dia.date), "dd/MM/yyyy")}</p>
                  <p>{dia.dayName}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueHorarios.map((horario) => (
            <tr key={horario}>
              {weekDaysWithHorarios.map((dia) => {
                const horarioData = dia.horarios.find(
                  (h) => h.horarioInicio === horario
                );
                return (
                  <td key={dia.date}>
                    {horarioData ? (
                      <div>
                        <p>
                          {horarioData.horarioInicio} -{" "}
                          {horarioData.horarioFinal}
                        </p>
                        <p>Viagens: {horarioData.viagens}</p>
                        <p>
                          {horarioData.sentido === "metroParaCampus"
                            ? "Metrô → Campus"
                            : "Campus → Metrô"}
                        </p>
                      </div>
                    ) : (
                      <p>---</p>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  ////////////////////////////////////////
  return (
    <div className="content">
      {isAuthenticated ? (
        <div className="container">
          <div className="navigation-btn">
            <button type="button" onClick={handlePrevWeek}>
              Semana Anterior
            </button>
            <button type="button" onClick={handleToday}>
              Semana Atual
            </button>
            <button type="button" onClick={handleNextWeek}>
              Próxima Semana
            </button>
          </div>
          {renderTable()}
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
