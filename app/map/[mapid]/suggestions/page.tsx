import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NoMapSidebar } from "@/components/nomapsidebar";
import {
    NoMapSidebarShellSkeleton,
    SuggestionsTableSkeleton,
} from "@/components/skeletons";
import { SuggestionsTable } from "@/components/suggestions-table";
import { auth } from "@/lib/auth";
import { getMapById } from "@/lib/db/queries/map";

export default async function SuggestionsPage({
    params,
}: {
    params: Promise<{ mapid: string }>;
}) {
    const { mapid } = await params;

    // Only map owner may access suggestions
    const session = await auth.api.getSession({ headers: await headers() });
    const maps = await getMapById(mapid);
    const m = maps[0];
    if (!m || !session || session.user.id !== m.ownerId) {
        redirect(`/map/${mapid}`);
    }

    return (
        <Suspense
            fallback={
                <NoMapSidebarShellSkeleton titleWidth="w-36">
                    <SuggestionsTableSkeleton />
                </NoMapSidebarShellSkeleton>
            }
        >
            <NoMapSidebar page="Map Suggestions">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Suggestions</h1>
                </div>
                <Suspense fallback={<SuggestionsTableSkeleton />}>
                    <SuggestionsTable mapId={mapid} />
                </Suspense>
            </NoMapSidebar>
        </Suspense>
    );
}
