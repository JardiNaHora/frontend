import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const RegisterVehicle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [nomeVeiculo, setNomeVeiculo] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [placaVeiculo, setPlacaVeiculo] = useState("");
  const [maxPassageiros, setMaxPassageiros] = useState("");

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

    // Aqui você pode realizar as ações necessárias com os dados do formulário
    console.log("Dados do Veículo:", {
      nomeVeiculo,
      tipoVeiculo,
      placaVeiculo,
      maxPassageiros,
    });

    // Limpar os campos após o envio do formulário
    setNomeVeiculo("");
    setTipoVeiculo("");
    setPlacaVeiculo("");
    setMaxPassageiros("");
  };

  return (
    <div className="content">
      {isAuthenticated ? (
        <div className="container">
          <div className="body">
            <h1>Registrar Veículo</h1>
            <form onSubmit={handleSubmit} className="veiculo">
              <label htmlFor="nome">Nome do veículo: </label>
              <input
                type="text"
                value={nomeVeiculo}
                onChange={(e) => setNomeVeiculo(e.target.value)}
              />
              <label htmlFor="tipo-veiculo">Tipo de veículo: </label>
              <input
                type="text"
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
              />
              <label htmlFor="placa">Número da placa: </label>
              <input
                type="text"
                value={placaVeiculo}
                onChange={(e) => setPlacaVeiculo(e.target.value)}
              />
              <label htmlFor="passageiros">
                Número máximo de passageiros:{" "}
              </label>
              <input
                type="number"
                value={maxPassageiros}
                onChange={(e) => setPlacaVeiculo(e.target.value)}
              />
              <div>
                <input type="reset" />
                <input type="submit" value="Registrar Veículo" />
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
