import React, { useState, useMemo, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

import "./styles.css";

const libraries = ["places", "directions"];
const jardineira = { lat: -3.869545, lng: -38.61568 }; // jardineira
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
  const [jardineira, setJardineira] = useState({
    lat: -3.869545,
    lng: -38.61568,
  });
  const [origin, setOrigin] = useState(jardineira);
  const [destination, setDestination] = useState(metro);
  const [response, setResponse] = useState(null);

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
  );
};

export default Map;
