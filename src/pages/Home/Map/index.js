import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";

import "./styles.css";

const libraries = ["places", "directions"];
// const jardineira = { lat: -3.869545, lng: -38.61568 }; // jardineira
const center = { lat: -3.869545, lng: -38.61568 }; // central overview
const ifce = { lat: -3.871737, lng: -38.612374 }; // IFCE campus Maracanaú
const metro = { lat: -3.867573, lng: -38.619985 }; // Estação Metrofor Virgílio Távora

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

export const Map = () => {
  const [jardineira, setJardineira] = useState(null);
  const [origin, setOrigin] = useState(jardineira);
  const [destination, setDestination] = useState(metro);
  const [response, setResponse] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  // Importa as variáveis do arquivo .env
  const THINGSPEAK_CHANNEL_ID = process.env.REACT_APP_THINGSPEAK_CHANNEL_ID;
  const THINGSPEAK_API_KEY = process.env.REACT_APP_THINGSPEAK_API_KEY;

  //teste do chatgpt
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usa as variáveis do arquivo .env na URL da requisição
        const response = await axios.get(
          `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`
        );
        // O resto do código permanece igual
        setJardineira({
          lat: parseFloat(response.data.feeds[0].field1),
          lng: parseFloat(response.data.feeds[0].field2),
        });
        setOrigin({
          lat: parseFloat(response.data.feeds[0].field1),
          lng: parseFloat(response.data.feeds[0].field2),
        });
      } catch (error) {
        console.error("Erro ao obter informações da API", error);
      }
    };

    // Chama a função fetchData imediatamente
    fetchData();

    // Configura o intervalo para chamar a função fetchData a cada 10 segundos
    const intervalId = setInterval(fetchData, 10000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

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
    <div className="map">
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        zoom={16}
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

        {response && directionsRendererOptions && true && (
          <DirectionsRenderer options={directionsRendererOptions} />
        )}
        <Marker
          position={ifce}
          icon={"https://img.icons8.com/?size=36&id=79416&format=png"}
          options={{ label: { text: "IFCE", className: "marker" } }}
        />
        <Marker
          position={jardineira}
          icon={"https://img.icons8.com/?size=36&id=37860&format=png"}
        />
        <Marker
          position={metro}
          icon={"https://img.icons8.com/?size=36&id=16693&format=png"}
          options={{
            label: { text: "Virgílio Távora", className: "marker" },
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default Map;
