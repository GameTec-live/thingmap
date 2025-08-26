"use client";
import { Edit } from "lucide-react";
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
import type { Pin } from "@/lib/db/queries/pins";
import { Button } from "../ui/button";
import { EditPinForm } from "./editpinform";

export default function EditPinButton({ pin }: { pin: Pin }) {
    const { data: session } = authClient.useSession();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size={"icon"}
                    disabled={!session || session.user.id !== pin.ownerId}
                >
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit a pin</DialogTitle>
                    <DialogDescription>Pin ID: {pin.id}</DialogDescription>
                </DialogHeader>
                <EditPinForm pin={pin} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
