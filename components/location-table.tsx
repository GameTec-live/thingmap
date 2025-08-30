import { ExternalLink } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getPinsByMapId } from "@/lib/db/queries/pins";
import EditPinButton from "./editpinform/editbutton";
import LocationDeleteButton from "./location-delete-button";

export async function LocationTable({ mapId }: { mapId: string }) {
    const pins = await getPinsByMapId(mapId);
    return (
        <div className="w-full">
            <Table className="w-full">
                <TableCaption>
                    A list of all locations in this map.
                </TableCaption>
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
                            <TableCell className="truncate">{pin.id}</TableCell>
                            <TableCell className="truncate max-w-32">
                                {pin.title}
                            </TableCell>
                            <TableCell className="whitespace-normal break-words">
                                {pin.description}
                            </TableCell>
                            <TableCell className="truncate max-w-32">
                                {pin.creatorname ?? "unknown"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {pin.latitude}° N, {pin.longitude}° W
                            </TableCell>
                            <TableCell className="whitespace-normal break-words">
                                {pin.address}
                            </TableCell>
                            <TableCell>
                                {pin.link ? (
                                    <a
                                        className="underline inline-flex flex-wrap gap-1 items-center break-all"
                                        href={pin.link ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="break-all">
                                            {pin.link}
                                        </span>
                                        <ExternalLink size={16} />
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </TableCell>
                            <TableCell>
                                <EditPinButton pin={pin} />
                                <LocationDeleteButton
                                    pinId={pin.id}
                                    ownerId={pin.ownerId}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
