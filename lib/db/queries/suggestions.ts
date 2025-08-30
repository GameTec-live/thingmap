"use server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { map, suggestion, user } from "../schema";
import { createPinProvideCreator } from "./pins";

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

export async function getSuggestionsByMapId(mapId: string) {
    const rows = await db
        .select({
            id: suggestion.id,
            title: suggestion.title,
            description: suggestion.description,
            link: suggestion.link,
            address: suggestion.address,
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
            isIssue: suggestion.isIssue,
            createdAt: suggestion.createdAt,
            updatedAt: suggestion.updatedAt,
            suggesterName: user.name,
            ownerId: map.ownerId,
        })
        .from(suggestion)
        .where(eq(suggestion.mapId, mapId))
        .leftJoin(user, eq(suggestion.userId, user.id))
        .leftJoin(map, eq(suggestion.mapId, map.id));

    return rows;
}

export async function deleteSuggestion(suggestionId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("No session found");

    const existing = await db
        .select({ sid: suggestion.id })
        .from(suggestion)
        .leftJoin(map, eq(suggestion.mapId, map.id))
        .where(
            and(
                eq(suggestion.id, suggestionId),
                eq(map.ownerId, session.user.id),
            ),
        )
        .limit(1);

    if (existing.length <= 0) throw new Error("Suggestion not found");

    await db.delete(suggestion).where(eq(suggestion.id, suggestionId));
}

export async function applySuggestion(suggestionId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("No session found");

    const rows = await db
        .select({
            id: suggestion.id,
            title: suggestion.title,
            description: suggestion.description,
            link: suggestion.link,
            address: suggestion.address,
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
            mapId: suggestion.mapId,
            ownerId: map.ownerId,
            userId: suggestion.userId,
        })
        .from(suggestion)
        .leftJoin(map, eq(suggestion.mapId, map.id))
        .where(
            and(
                eq(suggestion.id, suggestionId),
                eq(map.ownerId, session.user.id),
            ),
        )
        .limit(1);

    if (rows.length <= 0)
        throw new Error("Suggestion not found or unauthorized");

    const s = rows[0];

    await createPinProvideCreator({
        title: s.title,
        description: s.description ?? undefined,
        link: s.link ?? undefined,
        address: s.address ?? "",
        latitude: s.latitude,
        longitude: s.longitude,
        mapId: s.mapId,
        creatorId: s.userId,
    });

    await db.delete(suggestion).where(eq(suggestion.id, suggestionId));
}

export type GetSuggestionsByMapIdResult = Awaited<
    ReturnType<typeof getSuggestionsByMapId>
>;
export type SuggestionRow = GetSuggestionsByMapIdResult[number];
