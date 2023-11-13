import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";

import {
  GoogleMap,
  useLoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../store/slice";
import { useNavigate } from "react-router-dom";

const libraries = ["places", "directions"];
const jardineira = { lat: -3.869545, lng: -38.61568 }; // jardineira
const center = { lat: -3.869545, lng: -38.61568 }; // central overview
const ifce = { lat: -3.871737, lng: -38.612374 }; // IFCE campus Maracanaú
const metro = { lat: -3.867573, lng: -38.619985 }; // Estação Metrofor Virgílio Távora

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Estilo personalizado para o mapa
const mapStyles = [
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }], // mudar pra 'on' mostra as estações
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

export const Home = () => {
  //teste
  const [jardineira, setJardineira] = useState({
    lat: -3.869545,
    lng: -38.61568,
  });
  const [origin, setOrigin] = useState(jardineira);
  const [destination, setDestination] = useState(metro);
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    axios
      .get("http://localhost:8080/home/auth", { withCredentials: true })
      .then((response) => {
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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  //teste
  const directionsServiceOptions = useMemo(() => {
    return {
      origin,
      destination,
      travelMode: "DRIVING",
    };
  }, [origin, destination]);

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === "OK") {
      setResponse(res);
    } else {
      console.log(res);
    }
  }, []);

  const directionsRendererOptions = useMemo(() => {
    return {
      markerOptions: { visible: false },
      directions: response,
    };
  }, [response]);
  //

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <button
            onClick={() => {
              window.location.href = "http://localhost:8080/logout";
            }}
          >
            sair
          </button>
          <div className="map">
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              zoom={15.5}
              center={center}
              options={{
                styles: mapStyles,
                //buttons
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
              }}
              clickableIcons={false}
            >
              {jardineira && destination && (
                <DirectionsService
                  options={directionsServiceOptions}
                  callback={directionsCallback}
                />
              )}

              {response && directionsRendererOptions && (
                <DirectionsRenderer options={directionsRendererOptions} />
              )}
              <Marker
                position={ifce}
                options={{ label: { text: "IFCE", className: "marker" } }}
              />
              <Marker
                position={metro}
                icon={"https://img.icons8.com/?size=36&id=16556&format=png"}
                options={{
                  label: { text: "Virgílio Távora", className: "marker" },
                }}
              />
            </GoogleMap>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            window.location.href =
              "http://localhost:8080/oauth2/authorization/google";
          }}
        >
          Logar com o Google
        </button>
      )}
    </div>
  );
};
