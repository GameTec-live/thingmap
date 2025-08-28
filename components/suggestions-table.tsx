import { ExternalLink, OctagonAlert, PlusCircle } from "lucide-react";
import { getSuggestionsByMapId } from "@/lib/db/queries/suggestions";
import { SuggestionActions } from "./suggestions/actions";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

export async function SuggestionsTable({ mapId }: { mapId: string }) {
    const suggestions = await getSuggestionsByMapId(mapId);

    return (
        <div className="w-full">
            <Table className="w-full">
                <TableCaption>
                    A list of all suggestions and issues.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Lat / Longitude</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {suggestions.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell className="truncate">{s.id}</TableCell>
                            <TableCell className="flex items-center gap-1">
                                {s.isIssue ? (
                                    <span className="inline-flex items-center gap-1">
                                        <OctagonAlert size={16} /> Issue
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1">
                                        <PlusCircle size={16} /> Suggestion
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="truncate max-w-32">
                                {s.title}
                            </TableCell>
                            <TableCell className="whitespace-normal break-words">
                                {s.description}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {s.latitude}° N, {s.longitude}° W
                            </TableCell>
                            <TableCell className="whitespace-normal break-words">
                                {s.address}
                            </TableCell>
                            <TableCell>
                                {s.link ? (
                                    <a
                                        className="underline inline-flex flex-wrap gap-1 items-center break-all"
                                        href={s.link ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="break-all">
                                            {s.link}
                                        </span>
                                        <ExternalLink size={16} />
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </TableCell>
                            <TableCell className="truncate max-w-32">
                                {s.suggesterName ?? "Guest"}
                            </TableCell>
                            <TableCell>
                                <SuggestionActions
                                    suggestionId={s.id}
                                    ownerId={s.ownerId}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
