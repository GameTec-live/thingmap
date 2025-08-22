"use server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { favoriteMap, favoritePin, map, pin } from "../schema";

export async function getFavoritesOfUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const rows = await db
        .select({
            mapId: map.id,
            mapTitle: map.name,
            pinTitle: pin.title,
            favPinId: favoritePin.id,
        })
        .from(favoriteMap)
        .innerJoin(map, eq(map.id, favoriteMap.mapId))
        .leftJoin(pin, eq(pin.mapId, map.id))
        .leftJoin(
            favoritePin,
            and(
                eq(favoritePin.pinId, pin.id),
                eq(favoritePin.userId, session.user.id),
            ),
        )
        .where(eq(favoriteMap.userId, session.user.id));

    const byMap = new Map<
        string,
        {
            title: string;
            mapId: string;
            pins: { pinId: string; pinTitle: string }[];
        }
    >();
    for (const r of rows) {
        if (!byMap.has(r.mapId))
            byMap.set(r.mapId, { title: r.mapTitle, mapId: r.mapId, pins: [] });
        const entry = byMap.get(r.mapId);
        if (entry && r.favPinId && r.pinTitle)
            entry.pins.push({ pinId: r.favPinId, pinTitle: r.pinTitle });
    }

    return Array.from(byMap.values());
}

export type GetFavoritesOfUserQueryResult = Awaited<
    ReturnType<typeof getFavoritesOfUser>
>;
