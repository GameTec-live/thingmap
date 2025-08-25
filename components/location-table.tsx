import { getPinsByMapId } from "@/lib/db/queries/pins";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import LocationDeleteButton from "./location-delete-button";

export async function LocationTable({ mapId }: { mapId: string }) {
    const pins = await getPinsByMapId(mapId);
    return (
        <Table>
            <TableCaption>A list of all locations in this map.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Lat / Longitude</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pins.map((pin) => (
                    <TableRow key={pin.id}>
                        <TableCell className="font-medium">{pin.id}</TableCell>
                        <TableCell>{pin.title}</TableCell>
                        <TableCell className="truncate">
                            {pin.description}
                        </TableCell>
                        <TableCell>{pin.creatorname}</TableCell>
                        <TableCell>
                            {pin.latitude}° N, {pin.longitude}° W
                        </TableCell>
                        <TableCell>{pin.address}</TableCell>

                        <TableCell>
                            {pin.link ? (
                                <a
                                    className="underline flex flex-row gap-1 items-center"
                                    href={pin.link ?? undefined}
                                    target="_blank"
                                >
                                    {pin.link}
                                    <ExternalLink size={16} />
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </TableCell>
                        <TableCell>
                            <LocationDeleteButton
                                pinId={pin.id}
                                ownerId={pin.ownerId}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
