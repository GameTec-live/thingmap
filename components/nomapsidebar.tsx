import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
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
import { ModeToggle } from "./mode-toggle";

export async function NoMapSidebar({
    page,
    children,
}: Readonly<{
    page: string;
    children: React.ReactNode;
}>) {
    const maps = await getAllMaps();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const favorites = session ? await getFavoritesOfUser() : [];
    const createdMaps = session ? await getAllOwnedMaps() : [];

    return (
        <SidebarProvider>
            <AppSidebar
                currentMapId={process.env.MAP_HOMEMAPID ?? "1"}
                maps={maps}
                favorites={favorites}
                createdMaps={createdMaps}
                allowMapCreation={process.env.MAP_DISABLEMAPCREATION !== "true"}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <ModeToggle />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">
                                        {process.env.MAP_NAME ?? "ThingMap"}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{page}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
