import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NoMapSidebar } from "@/components/nomapsidebar";
import { NoMapSidebarShellSkeleton } from "@/components/skeletons";
import UserDetails from "@/components/userdetails";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/login");
    }

    return (
        <Suspense fallback={<NoMapSidebarShellSkeleton titleWidth="w-24" />}>
            <NoMapSidebar page="Settings">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Settings</h1>
                </div>
                <UserDetails />
                <div>
                    <a href="https://github.com/GameTec-live/thingmap">
                        Powered by Thingmap
                    </a>
                    <p>AGPLV3 licensed</p>
                </div>
            </NoMapSidebar>
        </Suspense>
    );
}
