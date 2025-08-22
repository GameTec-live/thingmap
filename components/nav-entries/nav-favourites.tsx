import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { GetFavoritesOfUserQueryResult } from "@/lib/db/queries/favourites";

export function NavFavourites({
    favorites,
}: {
    favorites: GetFavoritesOfUserQueryResult;
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Favourite maps</SidebarGroupLabel>
            <SidebarMenu>
                {favorites.length === 0 && (
                    <SidebarMenuItem className="p-2 h-8 text-xs text-sidebar-foreground/70">
                        No favorites
                    </SidebarMenuItem>
                )}
                {favorites.map((fav) => {
                    const hasPins =
                        Array.isArray(fav.pins) && fav.pins.length > 0;

                    if (!hasPins) {
                        return (
                            <SidebarMenuItem key={fav.mapId}>
                                <SidebarMenuButton asChild>
                                    <Link href={`/map/${fav.mapId}`}>
                                        <span>{fav.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={fav.mapId}
                            asChild
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <div className="flex items-center">
                                    <SidebarMenuButton asChild>
                                        <Link href={`/map/${fav.mapId}`}>
                                            <span>{fav.title}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                    <CollapsibleTrigger asChild>
                                        <div className="flex w-1/3 items-center rounded-md p-2 transition-[width,height,padding] hover:bg-sidebar-accent [&>svg]:size-4">
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </div>
                                    </CollapsibleTrigger>
                                </div>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {fav.pins.map((pin) => (
                                            <SidebarMenuSubItem key={pin.pinId}>
                                                <SidebarMenuSubButton
                                                    href={`/map/${fav.mapId}?pin=${pin.pinId}`}
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/map/${fav.mapId}?pin=${pin.pinId}`}
                                                    >
                                                        {" "}
                                                        <span>
                                                            {pin.pinTitle}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
