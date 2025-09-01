"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
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
import {
    type GetFavoritesOfUserQueryResult,
    toggleFavoriteMap,
} from "@/lib/db/queries/favourites";
import type { GetAllMapsQueryResult } from "@/lib/db/queries/map";
import { CorrectIssueButton } from "./createsuggestionform/add-issue-button";
import { AddPinButton } from "./createsuggestionform/add-pin-button";
import { MapSwitcher } from "./map-switcher";
import { NavFavourites } from "./nav-entries/nav-favourites";
import { NavNewMap } from "./nav-entries/nav-new-map";
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
    allowMapCreation,
    ...props
}: {
    maps: GetAllMapsQueryResult;
    currentMapId: string;
    favorites: GetFavoritesOfUserQueryResult;
    createdMaps: GetAllOwnedMapsQueryResult;
    allowMapCreation: boolean;
} & React.ComponentProps<typeof Sidebar>) {
    const currentMap = maps.find((map) => map.id === currentMapId);

    const { data: session } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const isMapFavorited = favorites.some(
        (favMap) =>
            favMap.mapId === currentMapId && favMap.includedBecause !== "pin",
    );

    const favoriteMap = (mapId: string | undefined) => {
        if (!mapId) return;
        startTransition(async () => {
            const removed = await toggleFavoriteMap(mapId);
            toast(removed ? "Map unfavorited!" : "Map favorited!");
            router.refresh();
        });
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <MapSwitcher
                    maps={maps}
                    currentMapId={currentMapId}
                    allowMapCreation={allowMapCreation}
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Info about {currentMap?.name} </CardTitle>
                        <CardDescription>
                            Created by {currentMap?.username}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{currentMap?.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between">
                        <div>
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="mr-2 p-0"
                                onClick={() => favoriteMap(currentMap?.id)}
                                disabled={!session || isPending}
                            >
                                <Star
                                    fill={isMapFavorited ? "white" : "none"}
                                />
                            </Button>
                            <CorrectIssueButton mapId={currentMap?.id} />
                        </div>
                        <AddPinButton mapId={currentMap?.id} />
                    </CardFooter>
                </Card>
            </SidebarHeader>
            <SidebarContent>
                {session && (
                    <>
                        <NavFavourites favorites={favorites} />
                        <NavYourMaps createdMaps={createdMaps} />
                        {allowMapCreation && <NavNewMap />}
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
