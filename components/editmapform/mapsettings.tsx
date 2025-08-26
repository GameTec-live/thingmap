import { getMapById } from "@/lib/db/queries/map";
import { EditMapForm } from "./editmapform";
import MapDeleteButton from "./map-delete-button";

export async function MapSettings({ mapid }: { mapid: string }) {
    const maps = await getMapById(mapid);
    return (
        <div>
            <EditMapForm map={maps[0]} />
            <MapDeleteButton mapId={maps[0].id} ownerId={maps[0].ownerId} />
        </div>
    );
}
