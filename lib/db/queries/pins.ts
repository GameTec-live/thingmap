"use server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { map, pin, user } from "../schema";

export async function getPinsByMapId(mapId: string) {
    const pins = await db
        .select({
            id: pin.id,
            title: pin.title,
            description: pin.description,
            createdAt: pin.createdAt,
            updatedAt: pin.updatedAt,
            creatorname: user.name,
            latitude: pin.latitude,
            longitude: pin.longitude,
            link: pin.link,
            address: pin.address,
            ownerId: map.ownerId,
        })
        .from(pin)
        .where(eq(pin.mapId, mapId))
        .leftJoin(user, eq(pin.creatorId, user.id))
        .leftJoin(map, eq(pin.mapId, map.id));
    return pins;
}

export async function deletePin(pinId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const existingPin = await db
        .select()
        .from(pin)
        .leftJoin(map, eq(pin.mapId, map.id))
        .where(and(eq(pin.id, pinId), eq(map.ownerId, session.user.id)))
        .limit(1);

    if (existingPin.length <= 0) {
        throw new Error("Pin not found");
    }

    await db.delete(pin).where(eq(pin.id, pinId));
}

export async function createPin(data: {
    title: string;
    description?: string;
    link?: string;
    address: string;
    latitude: number;
    longitude: number;
    mapId: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    // Check if is owner of map
    const mapOwner = await db
        .select()
        .from(map)
        .where(eq(map.id, data.mapId))
        .limit(1);

    if (!mapOwner || mapOwner[0].ownerId !== session.user.id) {
        throw new Error("Not authorized");
    }

    await db.insert(pin).values({
        ...data,
        creatorId: session.user.id,
    });
}

export async function updatePin(data: {
    pinId: string;
    title: string;
    description?: string;
    link?: string;
    address: string;
    latitude: number;
    longitude: number;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("No session found");
    }

    const existingPin = await db
        .select()
        .from(pin)
        .leftJoin(map, eq(pin.mapId, map.id))
        .where(and(eq(pin.id, data.pinId), eq(map.ownerId, session.user.id)))
        .limit(1);

    if (existingPin.length <= 0) {
        throw new Error("Pin not found");
    }

    await db.update(pin).set(data).where(eq(pin.id, data.pinId));
}

export type GetPinsByMapIdQueryResult = Awaited<
    ReturnType<typeof getPinsByMapId>
>;
export type Pin = GetPinsByMapIdQueryResult[number];
