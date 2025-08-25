"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { CreatePinForm } from "./createpinform";

export function CreatePinButton({ mapId }: { mapId: string }) {
    const { data: session } = authClient.useSession();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!session}>Add Pin</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new pin</DialogTitle>
                    <DialogDescription>Map ID: {mapId}</DialogDescription>
                </DialogHeader>
                <CreatePinForm mapId={mapId} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
