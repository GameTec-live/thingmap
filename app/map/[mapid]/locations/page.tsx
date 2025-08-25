import { CreatePinButton } from "@/components/createpinform/createbutton";
import { LocationTable } from "@/components/location-table";
import { NoMapSidebar } from "@/components/nomapsidebar";
import { Suspense } from "react";

export default async function LocationsPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NoMapSidebar page="New Pin">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Locations</h1>
                    <CreatePinButton mapId={mapid} />
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <LocationTable mapId={mapid} />
                </Suspense>
            </NoMapSidebar>
        </Suspense>
    );
}
