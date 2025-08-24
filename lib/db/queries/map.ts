"use server";
import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { map, user } from "../schema";

export async function getMapById(id: string) {
    return await db
        .select({
            id: map.id,
            name: map.name,
            description: map.description,
            username: user.name,
        })
        .from(map)
        .where(eq(map.id, id))
        .leftJoin(user, eq(map.ownerId, user.id));
}

export async function getAllMaps() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        return await db
            .select({
                id: map.id,
                name: map.name,
                description: map.description,
                username: user.name,
            })
            .from(map)
            .leftJoin(user, eq(map.ownerId, user.id))
            .where(or(eq(map.public, true), eq(map.ownerId, session.user.id)));
    }

    return await db
        .select({
            id: map.id,
            name: map.name,
            description: map.description,
            username: user.name,
        })
        .from(map)
        .leftJoin(user, eq(map.ownerId, user.id))
        .where(eq(map.public, true));
}

export type GetMapByIdQueryResult = Awaited<ReturnType<typeof getMapById>>;
export type GetAllMapsQueryResult = Awaited<ReturnType<typeof getAllMaps>>;
