import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "./lib/supabase";

function App() {
  const [assets, setAssets] = useState([]);

  // Fetch assets from Supabase
  async function fetchAssets() {
    const { data, error } = await supabase.from("assets").select("*");

    if (!error) {
      setAssets(data);
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  // Handle map click
  function MapClickHandler() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;

        await supabase.from("assets").insert([
          {
            type: "New Asset",
            zone: "Auto",
            latitude: lat,
            longitude: lng,
            condition: "Good",
          },
        ]);

        fetchAssets();
      },
    });

    return null;
  }

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={[13.0827, 80.2707]} // Chennai coordinates
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {assets.map((asset) => (
          <Marker key={asset.id} position={[asset.latitude, asset.longitude]} />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
