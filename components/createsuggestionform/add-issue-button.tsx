import { Button } from "../ui/button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SuggestPinForm } from "./suggestpinform";
import { OctagonAlert } from "lucide-react";
export function CorrectIssueButton({ mapId }: { mapId: string | undefined }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <OctagonAlert />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Correct an issue</DialogTitle>
                    <DialogDescription>Map ID: {mapId}</DialogDescription>
                </DialogHeader>
                {mapId ? (
                    <SuggestPinForm
                        mapId={mapId}
                        close={() => setOpen(false)}
                        isIssue={true}
                    />
                ) : (
                    <p>No map found</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
