"use server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { z } from "zod";
import type { createmapformSchema } from "@/components/createmapform/createmapform-schema";
import type { editmapformSchema } from "@/components/editmapform/editmapform-schema";
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

    if (process.env.MAP_DISABLEMAPCREATION === "true") {
        throw new Error("Map creation is disabled");
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

export async function updateMap(
    id: string,
    data: z.infer<typeof editmapformSchema>,
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const existingMap = await db
        .select()
        .from(map)
        .where(and(eq(map.id, id), eq(map.ownerId, session.user.id)))
        .limit(1);

    if (existingMap.length <= 0) {
        throw new Error("Map not found");
    }

    await db
        .update(map)
        .set({
            name: data.name,
            description: data.description,
            public: data.public,
        })
        .where(eq(map.id, id));
}

export async function deleteMap(mapId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const existingMap = await db
        .select()
        .from(map)
        .where(and(eq(map.id, mapId), eq(map.ownerId, session.user.id)))
        .limit(1);

    if (existingMap.length <= 0) {
        throw new Error("Map not found");
    }

    await db.delete(map).where(eq(map.id, mapId));
}

export type GetAllOwnedMapsQueryResult = Awaited<
    ReturnType<typeof getAllOwnedMaps>
>;
