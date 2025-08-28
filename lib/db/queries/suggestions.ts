"use server";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { suggestion } from "../schema";

export async function submitPinSuggestion(data: {
    title: string;
    description?: string;
    link?: string;
    address: string;
    latitude: number;
    longitude: number;
    isIssue: boolean;
    mapId: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    await db.insert(suggestion).values({
        ...data,
        userId: session?.user?.id,
    });
}
