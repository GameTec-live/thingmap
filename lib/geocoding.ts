"use server";

export const geocode = async (address: string): Promise<GeocodeResponse> => {
    const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}`,
    );
    return response.json();
};

export const reverseGeocode = async (
    long: number,
    lat: number,
): Promise<ReverseGeocodeResponse> => {
    const response = await fetch(
        `https://photon.komoot.io/reverse?lon=${long}&lat=${lat}`,
    );
    return response.json();
};

export type AddressSuggestion = {
    id: string;
    label: string;
    lat: number;
    lon: number;
};

export async function getAddressSuggestions(
    q: string,
): Promise<AddressSuggestion[]> {
    const query = q.trim();
    if (query.length < 3) return [];

    const data = await geocode(query);

    const suggestions = data.features.slice(0, 8).map((f) => {
        const p = f.properties;
        const [lon, lat] = f.geometry.coordinates;

        const parts = [
            p.name,
            p.housenumber && p.street
                ? `${p.street} ${p.housenumber}`
                : p.street,
            p.city || p.locality || p.district,
            p.state,
            p.country,
        ].filter(Boolean) as string[];

        const label = Array.from(new Set(parts)).join(", ");

        return {
            id: String(p.osm_id),
            label: label || p.name || "Unnamed place",
            lat,
            lon,
        };
    });

    // Deduplicate by label to avoid multiple lines for same place
    const seen = new Set<string>();
    return suggestions.filter((s) => {
        if (seen.has(s.label)) return false;
        seen.add(s.label);
        return true;
    });
}

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

export interface GeocodeResponse {
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
            extent?: [number, number, number, number];
        };
        geometry: {
            type: "Point";
            coordinates: [number, number];
        };
    }>;
}
