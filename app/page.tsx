import { Suspense } from "react";
import { MainSidebar } from "@/components/mainsidebar";
import { MainSidebarSkeleton } from "@/components/skeletons";

export default function Page() {
    return (
        <Suspense fallback={<MainSidebarSkeleton />}>
            <MainSidebar currentMapId={process.env.MAP_HOMEMAPID ?? "1"} />
        </Suspense>
    );
}
