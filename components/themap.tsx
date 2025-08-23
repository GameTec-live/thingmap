import type { GetFavoritesOfUserQueryResult } from "@/lib/db/queries/favourites";
import { getPinsByMapId } from "@/lib/db/queries/pins";
import { ClientMap } from "./client-map";

export async function TheMap({
    currentMapId,
    favouritePins,
}: {
    currentMapId: string;
    favouritePins: GetFavoritesOfUserQueryResult;
}) {
    const pins = await getPinsByMapId(currentMapId);
    return <ClientMap pins={pins} favouritePins={favouritePins} />;
}
