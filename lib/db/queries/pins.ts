import { eq } from "drizzle-orm";
import { db } from "@/lib";
import { pin, user } from "../schema";

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
        })
        .from(pin)
        .where(eq(pin.mapId, mapId))
        .leftJoin(user, eq(pin.creatorId, user.id));
    return pins;
}

export type GetPinsByMapIdQueryResult = Awaited<
    ReturnType<typeof getPinsByMapId>
>;
export type Pin = GetPinsByMapIdQueryResult[number];
