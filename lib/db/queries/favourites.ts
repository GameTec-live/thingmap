"use server";
import { and, eq, isNotNull, or } from "drizzle-orm";
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
            pinId: pin.id,
            pinTitle: pin.title,
            favPinId: favoritePin.id,
            favMapId: favoriteMap.id,
        })
        .from(map)
        .leftJoin(
            favoriteMap,
            and(
                eq(favoriteMap.mapId, map.id),
                eq(favoriteMap.userId, session.user.id),
            ),
        )
        .leftJoin(pin, eq(pin.mapId, map.id))
        .leftJoin(
            favoritePin,
            and(
                eq(favoritePin.pinId, pin.id),
                eq(favoritePin.userId, session.user.id),
            ),
        )
        .where(or(isNotNull(favoriteMap.id), isNotNull(favoritePin.id)));

    const byMap = new Map<
        string,
        {
            title: string;
            mapId: string;
            isMapFavorited: boolean;
            hasFavoritedPins: boolean;
            pins: { pinId: string; favPinId: string; pinTitle: string }[];
        }
    >();

    for (const r of rows) {
        if (!byMap.has(r.mapId)) {
            byMap.set(r.mapId, {
                title: r.mapTitle,
                mapId: r.mapId,
                isMapFavorited: Boolean(r.favMapId),
                hasFavoritedPins: false,
                pins: [],
            });
        }
        const entry = byMap.get(r.mapId);
        if (!entry) continue;

        // Preserve true if we see it on any row
        if (r.favMapId) entry.isMapFavorited = true;

        // Only include favorited pins in the pins array and mark presence
        if (r.favPinId && r.pinId && r.pinTitle) {
            entry.hasFavoritedPins = true;
            entry.pins.push({
                pinId: r.pinId,
                favPinId: r.favPinId,
                pinTitle: r.pinTitle,
            });
        }
    }

    return Array.from(byMap.values()).map((m) => ({
        ...m,
        includedBecause:
            m.isMapFavorited && m.hasFavoritedPins
                ? "both"
                : m.isMapFavorited
                  ? "map"
                  : "pin",
    }));
}

export async function newFavoritePin(pinId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    await db.insert(favoritePin).values({
        pinId,
        userId: session.user.id,
    });
}

export async function newFavoriteMap(mapId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    await db.insert(favoriteMap).values({
        mapId,
        userId: session.user.id,
    });
}

export async function toggleFavoritePin(pinId: string) {
    if (!pinId) return;

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const existing = await db
        .select()
        .from(favoritePin)
        .where(
            and(
                eq(favoritePin.pinId, pinId),
                eq(favoritePin.userId, session.user.id),
            ),
        )
        .limit(1);

    if (existing.length > 0) {
        await db.delete(favoritePin).where(eq(favoritePin.id, existing[0].id));
        return true;
    } else {
        await newFavoritePin(pinId);
        return false;
    }
}

export async function toggleFavoriteMap(mapId: string) {
    if (!mapId) return;

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const existing = await db
        .select()
        .from(favoriteMap)
        .where(
            and(
                eq(favoriteMap.mapId, mapId),
                eq(favoriteMap.userId, session.user.id),
            ),
        )
        .limit(1);

    if (existing.length > 0) {
        await db.delete(favoriteMap).where(eq(favoriteMap.id, existing[0].id));
        return true;
    } else {
        await newFavoriteMap(mapId);
        return false;
    }
}

export type GetFavoritesOfUserQueryResult = Awaited<
    ReturnType<typeof getFavoritesOfUser>
>;
