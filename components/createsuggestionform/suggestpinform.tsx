"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { createPin } from "@/lib/db/queries/pins";
import { type AddressSuggestion, getAddressSuggestions } from "@/lib/geocoding";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { suggestpinformSchema } from "./suggestpinform-schema";
import { Checkbox } from "../ui/checkbox";
import { submitPinSuggestion } from "@/lib/db/queries/suggestions";

type FormValues = z.infer<typeof suggestpinformSchema>;

export function SuggestPinForm({
    mapId,
    isIssue,
    close,
}: {
    mapId: string;
    isIssue: boolean;
    close: () => void;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(suggestpinformSchema),
        defaultValues: {
            title: "",
            description: "",
            link: undefined,
            address: "",
            latitude: 0,
            longitude: 0,
            isIssue: isIssue,
        },
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            await submitPinSuggestion({
                ...values,
                mapId: mapId,
            });
            router.refresh();
            toast.success("Pin submitted successfully!");
            form.reset({
                title: "",
                description: "",
                link: undefined,
                address: "",
                latitude: 0,
                longitude: 0,
            });
            close();
        });
    };

    const [loadingAddrs, setLoadingAddrs] = useState(false);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const addrValue = form.watch("address");

    // Avoid race conditions between fast keystrokes
    const requestSeq = useRef(0);
    // Skip fetch right after selecting an item
    const selectingRef = useRef(false);
    // Debounce timer
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        // If value set by selection, skip one fetch cycle
        if (selectingRef.current) {
            selectingRef.current = false;
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const q = addrValue?.trim() ?? "";
        if (q.length < 3) {
            setSuggestions([]);
            setLoadingAddrs(false);
            return;
        }

        setLoadingAddrs(true);

        debounceRef.current = window.setTimeout(async () => {
            const mySeq = ++requestSeq.current;
            try {
                const results = await getAddressSuggestions(q);
                // Only apply latest response
                if (mySeq === requestSeq.current) {
                    setSuggestions(results);
                }
            } catch (e) {
                if (mySeq === requestSeq.current) {
                    console.error("Suggestion error:", e);
                    setSuggestions([]);
                }
            } finally {
                if (mySeq === requestSeq.current) {
                    setLoadingAddrs(false);
                }
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [addrValue]);

    const handleSelect = (s: AddressSuggestion) => {
        selectingRef.current = true;
        form.setValue("address", s.label);
        form.setValue("latitude", s.lat);
        form.setValue("longitude", s.lon);
        setSuggestions([]);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-lg flex flex-col gap-4"
            >
                <p className="text-xs text-foreground/70">
                    Submitting as{" "}
                    {session?.user?.name ? session.user.name : "Guest"}
                </p>
                <FormField
                    control={form.control}
                    name="isIssue"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row gap-2">
                                <FormLabel>Issue / Suggestion</FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(checked) =>
                                            field.onChange(!!checked)
                                        }
                                    />
                                </FormControl>
                            </div>
                            <FormDescription>
                                Is this suggestion an issue or a suggestion?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Pin Title" />
                            </FormControl>
                            <FormDescription>
                                {form.watch("isIssue")
                                    ? "What the title of the pin should be."
                                    : "The title of the pin."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Pin Description"
                                />
                            </FormControl>
                            <FormDescription>
                                {form.watch("isIssue")
                                    ? "Describe what the description of the Pin should be."
                                    : "Describe what this pin is about."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://example.com"
                                />
                            </FormControl>
                            <FormDescription>
                                {form.watch("isIssue")
                                    ? "The link that should be used instead."
                                    : "A link to a homepage or similar."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Address</FormLabel>
                            <Command shouldFilter={false}>
                                <CommandInput
                                    value={field.value}
                                    placeholder="Type an address..."
                                    onValueChange={(v) =>
                                        form.setValue("address", v)
                                    }
                                />
                                <CommandList>
                                    {loadingAddrs ? (
                                        <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Searching...
                                        </div>
                                    ) : null}
                                    {!loadingAddrs &&
                                    suggestions.length === 0 &&
                                    field.value.trim().length >= 3 ? (
                                        <CommandEmpty>
                                            No results found.
                                        </CommandEmpty>
                                    ) : null}
                                    <CommandGroup
                                        heading={
                                            suggestions.length
                                                ? "Suggestions"
                                                : undefined
                                        }
                                    >
                                        {suggestions.map((s) => (
                                            <CommandItem
                                                key={s.id}
                                                value={s.label}
                                                onSelect={() => handleSelect(s)}
                                            >
                                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>{s.label}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                            <p className="text-xs text-foreground/70">
                                {form.getValues("latitude") +
                                    ", " +
                                    form.getValues("longitude")}
                            </p>
                            <FormDescription>
                                {form.watch("isIssue")
                                    ? "The address where the pin should be located."
                                    : "The address where this pin is located."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {form.watch("isIssue")
                        ? "Submit Issue"
                        : "Submit Suggestion"}
                </Button>
            </form>
        </Form>
    );
}
