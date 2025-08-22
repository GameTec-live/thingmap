import { db } from "@/lib";
import { pin, user } from "../schema";
import { eq } from "drizzle-orm";

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
        })
        .from(pin)
        .where(eq(pin.mapId, mapId))
        .leftJoin(user, eq(pin.creatorId, user.id));
    return pins;
}

export type GetPinsByMapIdQueryResult = Awaited<
    ReturnType<typeof getPinsByMapId>
>;
