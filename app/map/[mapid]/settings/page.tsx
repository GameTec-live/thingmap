import { Suspense } from "react";
import { MapSettings } from "@/components/editmapform/mapsettings";
import { NoMapSidebar } from "@/components/nomapsidebar";
import {
    MapSettingsSkeleton,
    NoMapSidebarShellSkeleton,
} from "@/components/skeletons";
export default async function SettingsPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    return (
        <Suspense
            fallback={
                <NoMapSidebarShellSkeleton titleWidth="w-40">
                    <MapSettingsSkeleton />
                </NoMapSidebarShellSkeleton>
            }
        >
            <NoMapSidebar page="Map settings">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Map Settings</h1>
                </div>
                <Suspense fallback={<MapSettingsSkeleton />}>
                    <MapSettings mapid={mapid} />
                </Suspense>
            </NoMapSidebar>
        </Suspense>
    );
}
