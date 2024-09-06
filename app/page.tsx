"use client"

import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

export default function Home() {
  /*return (
    <div>
    <header>
      <TopBar />
    </header>
    <main className="">
      <Button>Test</Button>
    </main>
    </div>
  );*/
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-screen items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex h-screen items-center justify-center p-6">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
