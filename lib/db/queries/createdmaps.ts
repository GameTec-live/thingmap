"use server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { map } from "../schema";

export async function getAllOwnedMaps() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    return await db
        .select({
            id: map.id,
            name: map.name,
            description: map.description,
        })
        .from(map)
        .where(eq(map.ownerId, session.user.id));
}

export type GetAllOwnedMapsQueryResult = Awaited<
    ReturnType<typeof getAllOwnedMaps>
>;
