import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

// INFO: That post has info on custom markers https://ujjwaltiwari2.medium.com/a-guide-to-using-openstreetmap-with-react-70932389b8b1
export default function renderMap() {
    return (
        <MapContainer center={[48.2099862, 16.3742018]} zoom={13} className='flex h-screen items-center justify-center p-6'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[48.2099862, 16.3742018]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}