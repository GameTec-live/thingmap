"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenuSkeleton,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/*
  Reusable skeletons that mimic existing layouts to minimize layout shifts.
*/

function AppSidebarSkeleton() {
    return (
        <Sidebar>
            <SidebarHeader>
                {/* Map switcher */}
                <Skeleton className="h-9 w-full rounded-md" />
                {/* Map info card */}
                <Card className="p-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-9 rounded-md" />
                            <Skeleton className="h-9 w-24 rounded-md" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                </Card>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <div className="mt-1" />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

function HeaderBreadcrumbSkeleton({
    withMapName = true,
}: {
    withMapName?: boolean;
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {/* Mode toggle placeholder */}
                <Skeleton className="h-7 w-7 rounded-md" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {/* Breadcrumb */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    {withMapName ? (
                        <>
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

function MapViewportSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex-1">
                <Skeleton className="h-full w-full rounded-none" />
            </div>
        </div>
    );
}

// Full-page skeleton for routes using MainSidebar/TheMap
function MainSidebarSkeleton() {
    return (
        <SidebarProvider>
            <AppSidebarSkeleton />
            <SidebarInset>
                <HeaderBreadcrumbSkeleton withMapName />
                <MapViewportSkeleton />
            </SidebarInset>
        </SidebarProvider>
    );
}

// Full-page skeleton for routes using NoMapSidebar
function NoMapSidebarShellSkeleton({
    titleWidth = "w-32",
    children,
}: {
    titleWidth?: string;
    children?: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebarSkeleton />
            <SidebarInset>
                <HeaderBreadcrumbSkeleton withMapName={false} />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-row justify-between items-center">
                        <Skeleton className={`h-7 ${titleWidth}`} />
                        <Skeleton className="h-9 w-32" />
                    </div>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function TableSkeleton({
    columns = 6,
    rows = 6,
}: {
    columns?: number;
    rows?: number;
}) {
    const colKeys = React.useMemo(
        () =>
            Array.from({ length: columns }, (_, i) => ({
                id: `col-${columns}-${i}`,
            })),
        [columns],
    );
    const rowKeys = React.useMemo(
        () =>
            Array.from({ length: rows }, (_, i) => ({
                id: `row-${rows}-${i}`,
            })),
        [rows],
    );

    return (
        <div className="w-full">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        {colKeys.map((col) => (
                            <TableHead key={col.id}>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rowKeys.map((row) => (
                        <TableRow key={row.id}>
                            {colKeys.map((col) => (
                                <TableCell key={`${row.id}-${col.id}`}>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function LocationTableSkeleton() {
    // Matches 8 columns in LocationTable
    return <TableSkeleton columns={8} rows={8} />;
}

function SuggestionsTableSkeleton() {
    // Matches 9 columns in SuggestionsTable
    return <TableSkeleton columns={9} rows={8} />;
}

function SimpleFormSkeleton({ rows = 4 }: { rows?: number }) {
    const rowKeys = React.useMemo(
        () =>
            Array.from({ length: rows }, (_, i) => ({
                id: `frow-${rows}-${i}`,
            })),
        [rows],
    );
    return (
        <Card className="p-4 space-y-4">
            <Skeleton className="h-6 w-40" />
            {rowKeys.map((row) => (
                <div key={row.id} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ))}
            <div className="flex justify-end">
                <Skeleton className="h-9 w-28" />
            </div>
        </Card>
    );
}

function MapSettingsSkeleton() {
    return (
        <div className="space-y-4">
            <SimpleFormSkeleton rows={5} />
            <div className="flex justify-end">
                <Skeleton className="h-9 w-36" />
            </div>
        </div>
    );
}

export {
    AppSidebarSkeleton,
    HeaderBreadcrumbSkeleton,
    MainSidebarSkeleton,
    MapViewportSkeleton,
    NoMapSidebarShellSkeleton,
    LocationTableSkeleton,
    SuggestionsTableSkeleton,
    SimpleFormSkeleton,
    MapSettingsSkeleton,
};
