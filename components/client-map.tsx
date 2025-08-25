"use client";
import MapLibre, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { ExternalLink, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import {
    type GetFavoritesOfUserQueryResult,
    toggleFavoritePin,
} from "@/lib/db/queries/favourites";
import type { GetPinsByMapIdQueryResult, Pin } from "@/lib/db/queries/pins";
import { Button } from "./ui/button";

export function ClientMap({
    pins,
    favouritePins,
}: {
    pins: GetPinsByMapIdQueryResult;
    favouritePins: GetFavoritesOfUserQueryResult;
}) {
    const params = useSearchParams();
    const pinId = params.get("pin");
    const [detailsSheetOpen, setDetailsSheetOpen] = useState(
        // biome-ignore lint/complexity/noUselessTernary: idk why, but other options dont work - linter wonky
        pinId ? true : false,
    );
    const [selectedPin, setSelectedPin] = useState<Pin | null>(
        pinId ? (pins.find((pin) => pin.id === pinId) ?? null) : null,
    );

    const { data: session } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const isPinFavorited = favouritePins.some((favMap) =>
        favMap.pins.some((pin) => pin.pinId === selectedPin?.id),
    );

    const favouritePin = (pinId: string | undefined) => {
        if (!pinId) return;
        startTransition(async () => {
            const removed = await toggleFavoritePin(pinId);
            toast.success(removed ? "Pin unfavorited!" : "Pin favorited!");
            router.refresh();
        });
    };

    return (
        <>
            <MapLibre mapStyle="https://tiles.openfreemap.org/styles/liberty">
                {pins.map((pin) => (
                    <Marker
                        onClick={() => {
                            setSelectedPin(pin);
                            setDetailsSheetOpen(true);
                        }}
                        key={pin.id}
                        longitude={pin.longitude}
                        latitude={pin.latitude}
                    />
                ))}
            </MapLibre>
            <Sheet open={detailsSheetOpen} onOpenChange={setDetailsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="items-center flex flex-row">
                            {selectedPin?.title}
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="ml-2 p-0"
                                onClick={() => favouritePin(selectedPin?.id)}
                                disabled={!session || isPending}
                            >
                                <Star
                                    fill={isPinFavorited ? "white" : "none"}
                                />
                            </Button>
                        </SheetTitle>
                        <SheetDescription>
                            {`by ${selectedPin?.creatorname}`}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-row gap-4 text-sm text-muted-foreground ml-4">
                        {selectedPin?.latitude != null &&
                        selectedPin?.longitude != null ? (
                            <a
                                className="underline"
                                href={`https://www.google.com/maps/search/?api=1&query=${selectedPin.latitude},${selectedPin.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open coordinates in Google Maps"
                            >
                                {selectedPin.latitude}, {selectedPin.longitude}
                            </a>
                        ) : (
                            <>
                                <p>{selectedPin?.longitude}</p>
                                <p>{selectedPin?.latitude}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <p>{selectedPin?.description}</p>
                        {selectedPin?.address ? (
                            <a
                                className="underline"
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPin.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open address in Google Maps"
                            >
                                {selectedPin.address}
                            </a>
                        ) : null}
                        <div>
                            {selectedPin?.link && (
                                <>
                                    <a
                                        className="underline flex flex-row gap-1 items-center"
                                        href={selectedPin?.link ?? undefined}
                                        target="_blank"
                                    >
                                        {selectedPin?.link}
                                        <ExternalLink size={16} />
                                    </a>

                                    <p className="text-xs text-muted-foreground">
                                        This is a user provided external link.
                                        Be careful.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
