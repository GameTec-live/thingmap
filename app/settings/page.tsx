import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NoMapSidebar } from "@/components/nomapsidebar";
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
        <Suspense fallback={<div>Loading...</div>}>
            <NoMapSidebar page="Settings">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Settings</h1>
                </div>
                <UserDetails />
            </NoMapSidebar>
        </Suspense>
    );
}
