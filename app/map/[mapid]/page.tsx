import { Suspense } from "react";
import { MainSidebar } from "@/components/mainsidebar";

export default async function MapPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MainSidebar currentMapId={mapid} />
        </Suspense>
    );
}
