import {
    NoMapSidebarShellSkeleton,
    SimpleFormSkeleton,
} from "@/components/skeletons";

export default function Loading() {
    return (
        <NoMapSidebarShellSkeleton titleWidth="w-40">
            <SimpleFormSkeleton rows={6} />
        </NoMapSidebarShellSkeleton>
    );
}
