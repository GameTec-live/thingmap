import {
    LocationTableSkeleton,
    NoMapSidebarShellSkeleton,
} from "@/components/skeletons";

export default function Loading() {
    return (
        <NoMapSidebarShellSkeleton titleWidth="w-28">
            <LocationTableSkeleton />
        </NoMapSidebarShellSkeleton>
    );
}
