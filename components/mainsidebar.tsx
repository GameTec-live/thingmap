import { headers } from "next/headers";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getAllOwnedMaps } from "@/lib/db/queries/createdmaps";
import { getFavoritesOfUser } from "@/lib/db/queries/favourites";
import { getAllMaps } from "@/lib/db/queries/map";
import { TheMap } from "./themap";

export async function MainSidebar({ currentMapId }: { currentMapId: string }) {
    const maps = await getAllMaps();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const favorites = session ? await getFavoritesOfUser() : [];
    const createdMaps = session ? await getAllOwnedMaps() : [];

    return (
        <SidebarProvider>
            <AppSidebar
                currentMapId={currentMapId}
                maps={maps}
                favorites={favorites}
                createdMaps={createdMaps}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink>
                                        {
                                            maps.find(
                                                (map) =>
                                                    map.id === currentMapId,
                                            )?.name
                                        }
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <TheMap
                            currentMapId={currentMapId}
                            favouritePins={favorites}
                        />
                    </Suspense>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
