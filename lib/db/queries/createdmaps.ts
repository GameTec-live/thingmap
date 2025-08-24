"use server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { z } from "zod";
import type { createmapformSchema } from "@/components/createmapform/createmapform-schema";
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

export async function createNewMap(data: z.infer<typeof createmapformSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const newMap = await db
        .insert(map)
        .values({
            name: data.name,
            description: data.description,
            public: data.public,
            ownerId: session.user.id,
        })
        .returning();

    return newMap[0].id;
}

export type GetAllOwnedMapsQueryResult = Awaited<
    ReturnType<typeof getAllOwnedMaps>
>;
