import {
    MapSettingsSkeleton,
    NoMapSidebarShellSkeleton,
} from "@/components/skeletons";

export default function Loading() {
    return (
        <NoMapSidebarShellSkeleton titleWidth="w-40">
            <MapSettingsSkeleton />
        </NoMapSidebarShellSkeleton>
    );
}
