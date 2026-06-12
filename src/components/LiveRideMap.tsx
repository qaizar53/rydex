"use client";

import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

type MapStatus = "arriving" | "ongoing" | "completed";

type Props = {
  driverLocation: [Number, Number] | null;
  pickUpLocation: [Number, Number] | null;
  dropLocation: [Number, Number] | null;
  mapStatus: MapStatus;
  onStats: (data: {
    distanceToPickUp: number;
    etaToPickUp: number;
    distanceToDrop: number;
    etaToDrop: number;
  }) => void;
};

export const pickupIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      transform:translateY(-4px);
    ">
      <div style="
        background:#16a34a;
        color:white;
        padding:4px 10px;
        border-radius:999px;
        font-size:10px;
        font-weight:700;
        letter-spacing:0.08em;
        text-transform:uppercase;
        box-shadow:0 4px 12px rgba(0,0,0,0.15);
        white-space:nowrap;
      ">
        Pickup
      </div>

      <div style="
        width:2px;
        height:10px;
        background:#16a34a;
      "></div>

      <div style="
        width:18px;
        height:18px;
        border-radius:999px;
        background:#16a34a;
        border:4px solid white;
        box-shadow:0 4px 14px rgba(0,0,0,0.25);
      "></div>
    </div>
  `,
  iconSize: [100, 60],
  iconAnchor: [50, 60],
});

export const dropIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      transform:translateY(-4px);
    ">
      <div style="
        background:#dc2626;
        color:white;
        padding:4px 10px;
        border-radius:999px;
        font-size:10px;
        font-weight:700;
        letter-spacing:0.08em;
        text-transform:uppercase;
        box-shadow:0 4px 12px rgba(0,0,0,0.15);
        white-space:nowrap;
      ">
        Drop
      </div>

      <div style="
        width:2px;
        height:10px;
        background:#dc2626;
      "></div>

      <div style="
        width:18px;
        height:18px;
        border-radius:999px;
        background:#dc2626;
        border:4px solid white;
        box-shadow:0 4px 14px rgba(0,0,0,0.25);
      "></div>
    </div>
  `,
  iconSize: [100, 60],
  iconAnchor: [50, 60],
});

export const driverIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      transform:translateY(-4px);
    ">
      <div style="
        background:#18181b;
        color:white;
        padding:4px 10px;
        border-radius:999px;
        font-size:10px;
        font-weight:700;
        letter-spacing:0.08em;
        text-transform:uppercase;
        box-shadow:0 4px 12px rgba(0,0,0,0.15);
        white-space:nowrap;
      ">
        Driver
      </div>

      <div style="
        width:2px;
        height:8px;
        background:#18181b;
      "></div>

      <div style="
        width:28px;
        height:28px;
        border-radius:50%;
        background:white;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 4px 14px rgba(0,0,0,0.25);
        border:2px solid #18181b;
      ">
        🚕
      </div>
    </div>
  `,
  iconSize: [100, 60],
  iconAnchor: [50, 60],
});

function LiveRideMap({
  driverLocation,
  pickUpLocation,
  dropLocation,
  mapStatus,
  onStats,
}: Props) {
  const [routeToPickUp, setRouteToPickUp] = useState<[number, number][]>([]);

  const [routeToDrop, setRouteToDrop] = useState<[number, number][]>([]);

  useEffect(() => {
    // console.log("DEBUG", {
    //   driverLocation,
    //   pickUpLocation,
    //   dropLocation,
    // });

    // if (!driverLocation) {
    //   return;
    // }

    if (!driverLocation || !pickUpLocation || !dropLocation) {
      // console.log("Missing location");
      return;
    }

    const [pLat, pLon] = pickUpLocation as [number, number];
    const [dLat, dLon] = dropLocation as [number, number];
    const [drLat, drLon] = driverLocation as [number, number];

    // const [pLat, pLon] = pickUpLocation;
    // const [dLat, dLon] = dropLocation;
    // const [drLat, drLon] = driverLocation;

    const getRoute = async (
      startLat: number,
      startLon: number,
      endLat: number,
      endLon: number,
    ) => {
      const res = await axios.get(
        `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&steps=true`,
      );
      return res.data.routes?.[0];
    };

    const fetchRoutes = async () => {
      try {
        if (mapStatus === "arriving") {
          const pickUpRoute = await getRoute(drLat, drLon, pLat, pLon);

          const dropRoute = await getRoute(dLat, dLon, drLat, drLon);

          if (pickUpRoute) {
            setRouteToPickUp(
              pickUpRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
                lat,
                lon,
              ]),
            );
          }

          if (dropRoute) {
            setRouteToDrop(
              dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
                lat,
                lon,
              ]),
            );
          }

          onStats?.({
            distanceToPickUp: (pickUpRoute?.distance ?? 0) / 1000,
            etaToPickUp: (pickUpRoute?.duration ?? 0) / 60,

            distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
            etaToDrop: (dropRoute?.duration ?? 0) / 60,
          });
        } else {
          setRouteToPickUp([]);

          const dropRoute = await getRoute(dLat, dLon, drLat, drLon);
          if (dropRoute) {
            setRouteToDrop(
              dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
                lat,
                lon,
              ]),
            );
          }

          onStats?.({
            distanceToPickUp: 0,
            etaToPickUp: 0,

            distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
            etaToDrop: (dropRoute?.duration ?? 0) / 60,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoutes();
  }, [driverLocation, pickUpLocation, dropLocation, mapStatus]);

  // useEffect(() => {
  //   console.log({
  //     driverLocation,
  //     pickUpLocation,
  //     dropLocation,
  //   });
  // }, [driverLocation, pickUpLocation, dropLocation]);

  const showPickUpMarker = mapStatus === "arriving";
  const showPickUpRoute = mapStatus === "arriving" && routeToPickUp.length > 0;
  const showDropRoute = mapStatus !== "completed" && routeToDrop.length > 0;

  return (
    <div className="relative w-full h-full bg-zinc-100">
      {pickUpLocation && (
        <MapContainer
          zoom={13}
          center={pickUpLocation as any}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">"CARTO"</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />

          {showPickUpMarker && (
            <Marker
              position={pickUpLocation as any}
              icon={pickupIcon}
              draggable
            >
              <Tooltip direction="top" offset={[0, -50]}>
                {/* {pickUp} */}
                Pickup Location
              </Tooltip>
            </Marker>
          )}

          {dropLocation && (
            <Marker position={dropLocation as any} icon={dropIcon} draggable>
              <Tooltip direction="top" offset={[0, -50]}>
                {/* {drop} */}
                Drop Location
              </Tooltip>
            </Marker>
          )}

          {driverLocation && (
            <Marker
              position={driverLocation as [number, number]}
              icon={driverIcon}
            >
              <Tooltip direction="top" offset={[0, -50]}>
                Driver Location
              </Tooltip>
            </Marker>
          )}

          {showPickUpRoute && (
            <Polyline
              positions={routeToPickUp}
              pathOptions={{
                color: "#888",
                weight: 4,
                lineCap: "round",
                dashArray: "2 10",
              }}
            />
          )}

          {showDropRoute && (
            <Polyline
              positions={routeToDrop}
              pathOptions={{
                color: "#0a0a0a",
                weight: 4,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
}

export default LiveRideMap;
