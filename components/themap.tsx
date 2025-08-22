import { getPinsByMapId } from "@/lib/db/queries/pins";
import { ClientMap } from "./client-map";

export async function TheMap({ currentMapId }: { currentMapId: string }) {
    const pins = await getPinsByMapId(currentMapId);
    return <ClientMap pins={pins} />;
}
