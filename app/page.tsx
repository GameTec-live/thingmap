import { Suspense } from "react";
import { MainSidebar } from "@/components/mainsidebar";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MainSidebar currentMapId={process.env.MAP_HOMEMAPID ?? "1"} />
        </Suspense>
    );
}
