import { Suspense } from "react";
import { CreatePinButton } from "@/components/createpinform/createbutton";
import { LocationTable } from "@/components/location-table";
import { NoMapSidebar } from "@/components/nomapsidebar";
import {
    LocationTableSkeleton,
    NoMapSidebarShellSkeleton,
} from "@/components/skeletons";

export default async function LocationsPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    return (
        <Suspense
            fallback={
                <NoMapSidebarShellSkeleton titleWidth="w-28">
                    <LocationTableSkeleton />
                </NoMapSidebarShellSkeleton>
            }
        >
            <NoMapSidebar page="Map Pins">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Locations</h1>
                    <CreatePinButton mapId={mapid} />
                </div>
                <Suspense fallback={<LocationTableSkeleton />}>
                    <LocationTable mapId={mapid} />
                </Suspense>
            </NoMapSidebar>
        </Suspense>
    );
}
