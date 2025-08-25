"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { deletePin } from "@/lib/db/queries/pins";
import { Button } from "./ui/button";

export default function LocationDeleteButton({
    pinId,
    ownerId,
}: {
    pinId: string;
    ownerId: string | null;
}) {
    const { data: session } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleDelete = () => {
        startTransition(async () => {
            await deletePin(pinId);
            router.refresh();
            toast.success("Location deleted successfully");
        });
    };

    return (
        <Button
            variant="ghost"
            size={"icon"}
            onClick={handleDelete}
            disabled={!session || session.user.id !== ownerId || isPending}
        >
            <Trash2 />
        </Button>
    );
}
