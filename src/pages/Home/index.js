import React, { useState, useEffect } from "react";
import axios from "axios";
import Map from "./Map/index.js";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

// Importando os componentes do material-ui
import { styled } from "@mui/material/styles";
import { Button, Typography, Grid, Paper, Box } from "@mui/material";

import "./styles.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Criando um hook para definir os estilos personalizados
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledMap = styled(Box)(({ theme }) => ({
  height: "50vh",
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
}));

export const Home = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/home/auth", { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.data.auth.details.sessionId) {
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="p">🚐 Sentido: Campus → Metrô</Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <StyledMap className="mapa">
                  <Map />
                </StyledMap>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledPaper>
                <Typography variant="p">
                  🕒Partida: 7:40 / 🕒Chegada: 7:55
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledPaper>
                <Typography variant="p">🚐 Viagem: 3 de 4</Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.href = BACKEND_URL + "/oauth2/authorization/google";
          }}
        >
          Logar com o Google
        </Button>
      )}
    </div>
  );
};
