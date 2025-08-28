import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { SuggestPinForm } from "./suggestpinform";
export function AddPinButton({ mapId }: { mapId: string | undefined }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add a pin</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Suggest a new pin</DialogTitle>
                    <DialogDescription>Map ID: {mapId}</DialogDescription>
                </DialogHeader>
                {mapId ? (
                    <SuggestPinForm
                        mapId={mapId}
                        close={() => setOpen(false)}
                        isIssue={false}
                    />
                ) : (
                    <p>No map found</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
