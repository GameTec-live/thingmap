"use server";

export const reverseGeocode = async (
    long: number,
    lat: number,
): Promise<ReverseGeocodeResponse> => {
    const response = await fetch(
        `https://photon.komoot.io/reverse?lon=${long}&lat=${lat}`,
    );
    return response.json();
};

export interface ReverseGeocodeResponse {
    type: "FeatureCollection";
    features: Array<{
        type: "Feature";
        properties: {
            osm_type: string;
            osm_id: number;
            osm_key: string;
            osm_value: string;
            type?: string;
            postcode?: string;
            housenumber?: string;
            countrycode?: string;
            name?: string;
            country?: string;
            city?: string;
            district?: string;
            locality?: string;
            street?: string;
            state?: string;
            county?: string;
        };
        geometry: {
            type: "Point";
            coordinates: [number, number];
        };
    }>;
}
