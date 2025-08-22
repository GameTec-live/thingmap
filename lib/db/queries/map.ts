"use server";
import { eq } from "drizzle-orm";
import { db } from "@/lib";
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
    return await db
        .select({
            id: map.id,
            name: map.name,
            description: map.description,
            username: user.name,
        })
        .from(map)
        .leftJoin(user, eq(map.ownerId, user.id));
}

export type GetMapByIdQueryResult = Awaited<ReturnType<typeof getMapById>>;
export type GetAllMapsQueryResult = Awaited<ReturnType<typeof getAllMaps>>;
