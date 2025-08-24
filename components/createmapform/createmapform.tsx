"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { createNewMap } from "@/lib/db/queries/createdmaps";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
import { createmapformSchema } from "./createmapform-schema";

export function CreateMapForm() {
    const form = useForm<z.infer<typeof createmapformSchema>>({
        resolver: zodResolver(createmapformSchema),
        defaultValues: {
            name: "",
            description: "",
            public: true,
        },
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const onSubmit = (values: z.infer<typeof createmapformSchema>) => {
        startTransition(async () => {
            const id = await createNewMap(values);
            router.refresh();
            toast.success("Map created successfully!");
            redirect(`/map/${id}`);
        });
    };

    if (!session) {
        return <div>You must be logged in to create a map.</div>;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-lg flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Map Name" />
                            </FormControl>
                            <FormDescription>
                                This is the name of your map.
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
                                    placeholder="Map Description"
                                />
                            </FormControl>
                            <FormDescription>
                                Describe what this map is about.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="public"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row gap-2">
                                <FormLabel>Public</FormLabel>
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
                                Make this map public.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    Create Map
                </Button>
            </form>
        </Form>
    );
}
