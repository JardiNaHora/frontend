import React, { useState, useEffect } from "react";
import axios from "axios";
import Map from "./Map/index.js";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

// Importando os componentes do material-ui
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";

import "./styles.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Criando um hook para definir os estilos personalizados
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledMap = styled(Box)(({ theme }) => ({
  height: "300px",
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
      .get("http://localhost:8080/home/auth", { withCredentials: true })
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
    <div className={"root"}>
      {isAuthenticated ? (
        <div className="container">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={"title"}>
                Olá, {user}!
              </Typography>
              <Button
                color="inherit"
                onClick={() => {
                  window.location.href = BACKEND_URL + "/logout";
                }}
              >
                sair
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h5">🚐 Sentido: Campus → Metrô</Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <StyledMap>
                  <Map />
                </StyledMap>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledPaper>
                <Typography variant="h5">
                  🕒Partida: 7:40 / 🕒Chegada: 7:55
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledPaper>
                <Typography variant="h5">🚐 Viagem: 3 de 4</Typography>
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