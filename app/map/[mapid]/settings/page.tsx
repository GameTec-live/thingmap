import { Suspense } from "react";
import { MapSettings } from "@/components/editmapform/mapsettings";
import { NoMapSidebar } from "@/components/nomapsidebar";
export default async function SettingsPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NoMapSidebar page="Map settings">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Map Settings</h1>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <MapSettings mapid={mapid} />
                </Suspense>
            </NoMapSidebar>
        </Suspense>
    );
}
