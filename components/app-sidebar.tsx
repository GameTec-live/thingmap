"use client";

import { OctagonAlert } from "lucide-react";
import type React from "react";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import type { GetAllOwnedMapsQueryResult } from "@/lib/db/queries/createdmaps";
import type { GetFavoritesOfUserQueryResult } from "@/lib/db/queries/favourites";
import type { GetAllMapsQueryResult } from "@/lib/db/queries/map";
import { MapSwitcher } from "./map-switcher";
import { NavFavourites } from "./nav-entries/nav-favourites";
import { NavYourMaps } from "./nav-entries/nav-your-maps";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

export function AppSidebar({
    maps,
    currentMapId,
    favorites,
    createdMaps,
    ...props
}: {
    maps: GetAllMapsQueryResult;
    currentMapId: string;
    favorites: GetFavoritesOfUserQueryResult;
    createdMaps: GetAllOwnedMapsQueryResult;
} & React.ComponentProps<typeof Sidebar>) {
    const currentMap = maps.find((map) => map.id === currentMapId);

    const { data: session } = authClient.useSession();

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <MapSwitcher maps={maps} currentMapId={currentMapId} />
                <Card>
                    <CardHeader>
                        <CardTitle>Info about {currentMap?.name}</CardTitle>
                        <CardDescription>
                            Created by {currentMap?.username}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{currentMap?.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between">
                        <Button variant="outline" size="icon">
                            <OctagonAlert />
                        </Button>
                        <Button>Add a pin</Button>
                    </CardFooter>
                </Card>
            </SidebarHeader>
            <SidebarContent>
                {session && (
                    <>
                        <NavFavourites favorites={favorites} />
                        <NavYourMaps createdMaps={createdMaps} />
                    </>
                )}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
