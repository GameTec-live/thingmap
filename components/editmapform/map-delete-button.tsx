"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { deleteMap } from "@/lib/db/queries/createdmaps";
import { Button } from "../ui/button";

export default function MapDeleteButton({
    mapId,
    ownerId,
}: {
    mapId: string;
    ownerId: string | null;
}) {
    const { data: session } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleDelete = () => {
        startTransition(async () => {
            await deleteMap(mapId);
            router.replace("/");
            router.refresh();
            toast.success("Map deleted successfully");
        });
    };

    return (
        <Button
            variant="destructive"
            onClick={handleDelete}
            className="mt-4"
            disabled={!session || session.user.id !== ownerId || isPending}
        >
            Delete Map <Trash2 />
        </Button>
    );
}
