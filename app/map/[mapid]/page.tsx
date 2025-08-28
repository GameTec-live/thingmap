import { Suspense } from "react";
import { MainSidebar } from "@/components/mainsidebar";
import { MainSidebarSkeleton } from "@/components/skeletons";

export default async function MapPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    return (
        <Suspense fallback={<MainSidebarSkeleton />}>
            <MainSidebar currentMapId={mapid} />
        </Suspense>
    );
}
