"use client";
import { Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
    applySuggestion,
    deleteSuggestion,
} from "@/lib/db/queries/suggestions";
import { Button } from "../ui/button";

export function SuggestionActions({
    suggestionId,
    ownerId,
}: {
    suggestionId: string;
    ownerId: string | null;
}) {
    const { data: session } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onDelete = () => {
        startTransition(async () => {
            await deleteSuggestion(suggestionId);
            router.refresh();
            toast.success("Suggestion deleted");
        });
    };

    const onApply = () => {
        startTransition(async () => {
            await applySuggestion(suggestionId);
            router.refresh();
            toast.success("Suggestion applied and pin created");
        });
    };

    const disabled = !session || session.user.id !== ownerId || isPending;

    return (
        <div className="flex gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={onApply}
                disabled={disabled}
                title="Apply suggestion"
            >
                <Check />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                disabled={disabled}
                title="Delete suggestion"
            >
                <Trash2 />
            </Button>
        </div>
    );
}
