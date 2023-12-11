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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const EMAIL_TEST = process.env.REACT_APP_EMAIL_TEST;

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
  const [userLocation, setUserLocation] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  // Importa as variáveis do arquivo .env
  const THINGSPEAK_CHANNEL_ID = process.env.REACT_APP_THINGSPEAK_CHANNEL_ID;
  const THINGSPEAK_API_KEY = process.env.REACT_APP_THINGSPEAK_API_KEY;
  const THINGSPEAK_WRITE_API_KEY = process.env.REACT_APP_THINGSPEAK_WRITE_API_KEY;

  // pega as coordenadas do usuário
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setUserLocation({
        lat: parseFloat(position.coords.latitude),
        lng: parseFloat(position.coords.longitude),
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUser = await axios.get(BACKEND_URL + "/home/auth", {
          withCredentials: true,
        });
        if (responseUser.data.username === EMAIL_TEST) {
          navigator.geolocation.getCurrentPosition(async function (position) {
            const lat = parseFloat(position.coords.latitude);
            const lng = parseFloat(position.coords.longitude);
            setJardineira({ lat, lng });
            setOrigin({ lat, lng });
  
            // Atualiza a localização no ThingSpeak
            await axios.post(
              `https://api.thingspeak.com/update?api_key=${THINGSPEAK_WRITE_API_KEY}&field1=${lat}&field2=${lng}`
            );
          });
        } else {
          const response = await axios.get(
            `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`
          );
  
          setJardineira({
            lat: parseFloat(response.data.feeds[0].field1),
            lng: parseFloat(response.data.feeds[0].field2),
          });
          setOrigin({
            lat: parseFloat(response.data.feeds[0].field1),
            lng: parseFloat(response.data.feeds[0].field2),
          });
        }
      } catch (error) {
        console.error("Erro ao obter informações da API", error);
      }
    };
  // Chama a função fetchData imediatamente
  fetchData();
  getLocation();

  // Configura o intervalo para chamar a função fetchData a cada 10 segundos
  const intervalIdFetchData = setInterval(fetchData, 5000);
  const intervalIdGetLocation = setInterval(getLocation, 5000); // pega a posição do usuário

  // Limpa o intervalo quando o componente for desmontado
  return () => {
    clearInterval(intervalIdFetchData);
    clearInterval(intervalIdGetLocation);
  };
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
          zoomControl: false,
          //minimo e maximo de zoom
          // minZoom: 15,
          // maxZoom: 17,
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
          position={userLocation}
          icon={"https://img.icons8.com/?size=24&id=37170&format=png"}
          options={{ label: { text: "Usuário", className: "marker" } }}
        />
        https://img.icons8.com/?size=50&id=37170&format=png
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
