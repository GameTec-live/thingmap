"use client";
import MapLibre, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GetPinsByMapIdQueryResult } from "@/lib/db/queries/pins";

export function ClientMap({ pins }: { pins: GetPinsByMapIdQueryResult }) {
    return (
        <MapLibre mapStyle="https://tiles.openfreemap.org/styles/liberty">
            {pins.map((pin) => (
                <Marker
                    onClick={() => {
                        alert(`Marker clicked: ${pin.title}`);
                    }}
                    key={pin.id}
                    longitude={pin.longitude}
                    latitude={pin.latitude}
                />
            ))}
        </MapLibre>
    );
}
