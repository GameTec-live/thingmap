import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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
        <Suspense fallback={<div>Loading...</div>}>
            <NoMapSidebar page="New Map">
                <h1 className="text-2xl">Create a New Map</h1>
                <CreateMapForm />
            </NoMapSidebar>
        </Suspense>
    );
}
