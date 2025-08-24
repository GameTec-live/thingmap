import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateMapForm } from "@/components/createmapform/createmapform";
import { NoMapSidebar } from "@/components/nomapsidebar";
import { auth } from "@/lib/auth";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/login");
    }

    return (
        <NoMapSidebar page="New Map">
            <h1>Create a New Map</h1>
            <CreateMapForm />
        </NoMapSidebar>
    );
}
