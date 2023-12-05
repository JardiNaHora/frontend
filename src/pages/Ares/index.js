import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

const generateRandomData = () => {
  return {
    co2: Math.random() * 100,
    temperature: Math.random() * 40,
    humidity: Math.random() * 100,
  };
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Ares = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [dados, setDados] = useState({
    co2: [],
    temperature: [],
    humidity: [],
  });

  const [options, setOptions] = useState({
    chart: {
      id: "realtime",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
    },
    xaxis: {
      type: "category",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRandomData();

      setDados((prevDados) => {
        return {
          co2: [
            ...prevDados.co2,
            { x: new Date().toLocaleTimeString(), y: newData.co2 },
          ],
          temperature: [
            ...prevDados.temperature,
            { x: new Date().toLocaleTimeString(), y: newData.temperature },
          ],
          humidity: [
            ...prevDados.humidity,
            { x: new Date().toLocaleTimeString(), y: newData.humidity },
          ],
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="content">
      {isAuthenticated ? (
        <div className="container">
          <div className="body">
            <ReactApexChart
              className="grafico"
              options={{
                chart: {
                  id: "realtime",
                  animations: {
                    enabled: true,
                    easing: "linear",
                    dynamicAnimation: {
                      speed: 1000,
                    },
                  },
                  background: "#fff", // Altere a cor de fundo aqui
                },
                xaxis: {
                  type: "category",
                  labels: {
                    style: {
                      colors: "#333", // Altere a cor do texto aqui
                    },
                  },
                },
                yaxis: {
                  labels: {
                    formatter: function (val) {
                      return val.toFixed(2);
                    },
                    style: {
                      colors: "#333", // Altere a cor do texto aqui
                    },
                  },
                },
                theme: {
                  mode: "light", // Pode ser "light" ou "dark", dependendo do seu esquema de cores
                },
              }}
              series={[
                { name: "CO2", data: dados.co2 },
                { name: "Temperatura", data: dados.temperature },
                { name: "Umidade", data: dados.humidity },
              ]}
              type="line"
              height={350}
            />
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
