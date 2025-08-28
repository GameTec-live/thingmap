import {
    NoMapSidebarShellSkeleton,
    SuggestionsTableSkeleton,
} from "@/components/skeletons";

export default function Loading() {
    return (
        <NoMapSidebarShellSkeleton titleWidth="w-36">
            <SuggestionsTableSkeleton />
        </NoMapSidebarShellSkeleton>
    );
}
