"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
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
import { createpinformSchema } from "./createpinform-schema";
import { getAddressSuggestions, type AddressSuggestion } from "@/lib/geocoding";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { Loader2, MapPin } from "lucide-react";
import { createPin } from "@/lib/db/queries/pins";

type FormValues = z.infer<typeof createpinformSchema>;

export function CreatePinForm({
    mapId,
    close,
}: {
    mapId: string;
    close: () => void;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(createpinformSchema),
        defaultValues: {
            title: "",
            description: "",
            link: undefined,
            address: "",
            latitude: 0,
            longitude: 0,
        },
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            await createPin({
                ...values,
                mapId,
            });
            router.refresh();
            toast.success("Pin created successfully!");
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

    if (!session) {
        return <div>You must be logged in to create a pin.</div>;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-lg flex flex-col gap-4"
            >
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
                                This is the title of your pin.
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
                                Describe what this pin is about.
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
                                A link to a homepage or similar.
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
                                The address where this pin is located.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Pin
                </Button>
            </form>
        </Form>
    );
}
