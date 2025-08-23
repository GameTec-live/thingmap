import { reverseGeocode } from "@/lib/geocoding";

export async function AddressResolver({
    long,
    lat,
}: {
    long: number;
    lat: number;
}) {
    const address = await reverseGeocode(long, lat);
    return (
        <div>
            <p>{address.features[0].properties.name}</p>
            <p>{`${address.features[0].properties.street} ${address.features[0].properties.housenumber}, ${address.features[0].properties.postcode} ${address.features[0].properties.city}, ${address.features[0].properties.country}`}</p>
        </div>
    );
}
