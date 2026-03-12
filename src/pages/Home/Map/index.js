import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../../../services/api";
import "./styles.css";

// Coordenadas reais aproximadas do IFCE Maracanaú (centro inicial do mapa)
const IFCE_COORDS = { lat: -3.872985, lng: -38.610825 };

// Coordenadas aproximadas da Estação Virgílio Távora (metrô)
const METRO_COORDS = { lat: -3.868138, lng: -38.620047 };

// Ícones personalizados para mapa
const vehicleIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const campusIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const metroIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Corrige ícones padrão do Leaflet quando usado com bundlers (CRA)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Map = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Busca localização do usuário (opcional, para exibir no mapa)
  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Não foi possível obter localização do usuário:", error);
      }
    );
  };

  // Busca localizações atuais de todos os veículos do backend
  const loadVehicles = async () => {
    try {
      const response = await api.get("/vehicle/all/current-locations");
      // Espera lista de VehicleLocationDTO com latitude/longitude
      const list = response.data || [];
      const mapped = list
        .filter((v) => v.latitude !== null && v.longitude !== null)
        .map((v) => ({
          id: v.vehicleId,
          name: v.vehicleName,
          plate: v.vehiclePlate,
          lat: v.latitude,
          lng: v.longitude,
          status: v.status,
          lastUpdate: v.lastUpdate,
        }));
      setVehicles(mapped);
    } catch (error) {
      console.error("Erro ao carregar localizações de veículos:", error);
    }
  };

  useEffect(() => {
    // Carrega dados iniciais
    loadVehicles();
    getUserLocation();

    // Atualiza a cada 5 segundos (pode ser ajustado ou trocado por SSE depois)
    const intervalId = setInterval(() => {
      loadVehicles();
      getUserLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const center =
    vehicles.length > 0
      ? { lat: vehicles[0].lat, lng: vehicles[0].lng }
      : IFCE_COORDS;

  return (
    <div className="map">
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador do usuário (se disponível) */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Sua localização</Popup>
          </Marker>
        )}

        {/* Marcadores fixos de referência: IFCE e Metrô */}
        <Marker position={IFCE_COORDS} icon={campusIcon}>
          <Popup>IFCE Campus Maracanaú</Popup>
        </Marker>

        <Marker position={METRO_COORDS} icon={metroIcon}>
          <Popup>Estação Virgílio Távora (Metrô)</Popup>
        </Marker>

        {/* Marcadores dos veículos */}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={{ lat: vehicle.lat, lng: vehicle.lng }}
            icon={vehicleIcon}
          >
            <Popup>
              <strong>{vehicle.name || "Veículo"}</strong>
              <br />
              Placa: {vehicle.plate}
              <br />
              Status: {vehicle.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
