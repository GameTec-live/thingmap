import { CreateMapForm } from "@/components/createmapform/createmapform";
import { NoMapSidebar } from "@/components/nomapsidebar";

export default function Page() {
    return (
        <NoMapSidebar page="New Map">
            <h1>Create a New Map</h1>
            <CreateMapForm />
        </NoMapSidebar>
    );
}
