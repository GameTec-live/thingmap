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
import type { GetAllOwnedMapsQueryResult } from "@/lib/db/queries/createdmaps";

export function NavYourMaps({
    createdMaps,
}: {
    createdMaps: GetAllOwnedMapsQueryResult;
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Your maps</SidebarGroupLabel>
            <SidebarMenu>
                {createdMaps.length === 0 && (
                    <SidebarMenuItem className="p-2 h-8 text-xs text-sidebar-foreground/70">
                        No maps created
                    </SidebarMenuItem>
                )}
                {createdMaps.map((map) => (
                    <Collapsible
                        asChild
                        className="group/collapsible"
                        key={map.id}
                    >
                        <SidebarMenuItem>
                            <div className="flex items-center">
                                <SidebarMenuButton asChild>
                                    <Link href={`/map/${map.id}`}>
                                        <span>{map.name}</span>
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
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <span>Locations</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <span>Suggestions</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <span>Settings</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
