"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "better-auth";
import { Loader2, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export default function UserDetails() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="grid gap-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-64 bg-muted animate-pulse rounded" />
                    <div className="h-64 bg-muted animate-pulse rounded" />
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-sm text-muted-foreground">
                No user session found.
            </div>
        );
    }

    const user = session.user;

    return (
        <div className="grid gap-6">
            <ProfileSection user={user} />

            <div className="grid gap-6 md:grid-cols-2">
                <EmailSection user={user} />
                <PasswordSection />
            </div>

            <Separator />

            <DangerZone user={user} />
        </div>
    );
}

/* Profile */

const profileSchema = z.object({
    name: z
        .string()
        .max(120, "Max 120 characters.")
        .optional()
        .or(z.literal("")),
    image: z
        .string()
        .nullish()
        .or(z.literal(""))
        .refine(
            (v) => !v || v.startsWith("data:image/"),
            "Upload an image (PNG, JPEG, or WebP).",
        ),
});

function ProfileSection({ user }: { user: User }) {
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name ?? "",
            image: user.image ?? "",
        },
        mode: "onTouched",
    });

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const imagePreview = form.watch("image");
    const displayName = form.watch("name") || user.name || user.email || "User";
    const initials = displayName.trim().slice(0, 2).toUpperCase();

    async function resizeImageFile(file: File, maxSize = 512): Promise<string> {
        if (!file.type.startsWith("image/")) {
            throw new Error("Please select an image file.");
        }

        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const { width, height } = img;
                    const scale = Math.min(
                        maxSize / width,
                        maxSize / height,
                        1,
                    );
                    const targetW = Math.round(width * scale);
                    const targetH = Math.round(height * scale);

                    const canvas = document.createElement("canvas");
                    canvas.width = targetW;
                    canvas.height = targetH;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) {
                        reject(new Error("Canvas not supported."));
                        return;
                    }
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(img, 0, 0, targetW, targetH);

                    // Export as PNG data URL
                    resolve(canvas.toDataURL("image/png"));
                };
                img.onerror = () => reject(new Error("Invalid image data."));
                img.src = reader.result as string;
            };
            reader.onerror = () => reject(new Error("Failed to read file."));
            reader.readAsDataURL(file);
        });

        return dataUrl;
    }

    async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const dataUrl = await resizeImageFile(file, 512);
            form.setValue("image", dataUrl, {
                shouldDirty: true,
                shouldValidate: true,
            });
            toast.success("Image ready to save.");
        } catch {
            toast.error("Failed to process image.");
        } finally {
            // reset file input so selecting the same file again triggers change
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function handleRemoveImage() {
        form.setValue("image", null, {
            shouldDirty: true,
            shouldValidate: true,
        });
        toast.message("Image removed.");
    }

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        await authClient.updateUser({
            name: values.name || undefined,
            image: values.image,
        });
        toast.success("Profile updated");
    }

    const previewSrc = (imagePreview || user.image || undefined) as
        | string
        | undefined;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                    Basic information visible on your account.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-6 md:grid-cols-[180px_1fr]">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={previewSrc}
                                    alt={displayName}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Upload
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                >
                                    Remove
                                </Button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelected}
                            />

                            <p className="text-xs text-muted-foreground">
                                Max 512x512. PNG/JPEG/WebP are supported.
                            </p>

                            {/* keep image in form state, but no visible text input */}
                            <input type="hidden" {...form.register("image")} />
                        </div>

                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Your name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-1">
                                    <Label>User ID</Label>
                                    <code className="rounded bg-muted px-2 py-1 text-xs">
                                        {user.id}
                                    </code>
                                </div>
                                <div className="grid gap-1">
                                    <Label>Email</Label>
                                    <div className="text-sm">
                                        {user.email ?? "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Save changes
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

/* Email */

function makeEmailSchema(currentEmail: string | null | undefined) {
    return z.object({
        newEmail: z
            .email("Enter a valid email.")
            .refine(
                (v) => v.trim() !== (currentEmail ?? "").trim(),
                "Use a different email than your current one.",
            ),
    });
}

function EmailSection({ user }: { user: User }) {
    const EmailSchema = React.useMemo(
        () => makeEmailSchema(user.email),
        [user.email],
    );
    const form = useForm<z.infer<typeof EmailSchema>>({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            newEmail: user.email ?? "",
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof EmailSchema>) {
        try {
            await authClient.changeEmail({
                newEmail: values.newEmail,
            });
            toast.success("Email changed.");
        } catch {
            toast.error("Failed to change email.");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change email</CardTitle>
                <CardDescription>
                    Update your sign-in email. You may need to confirm via
                    email.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="newEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="justify-end mt-4">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Update email
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

/* Password */

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required."),
        newPassword: z.string().min(8, "Use at least 8 characters."),
        confirmNewPassword: z
            .string()
            .min(1, "Please confirm your new password."),
    })
    .refine((v) => v.newPassword === v.confirmNewPassword, {
        message: "Passwords do not match.",
        path: ["confirmNewPassword"],
    });

function PasswordSection() {
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        try {
            await authClient.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                revokeOtherSessions: true,
            });
            toast.success("Password updated");
        } catch {
            toast.error("Failed to update password.");
        }
        form.reset({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>
                    Use a strong, unique password.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Current password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="New password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm new password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="justify-end mt-4">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Update password
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

/* Danger zone / Delete */

function makeDeleteSchema(expected: string | null | undefined) {
    return z.object({
        confirm: z
            .string()
            .min(1, "Please type your email to confirm.")
            .refine(
                (v) => v.trim() === (expected ?? "").trim(),
                "Email does not match.",
            ),
    });
}

function DangerZone({ user }: { user: User }) {
    const [open, setOpen] = React.useState(false);
    const DeleteSchema = React.useMemo(
        () => makeDeleteSchema(user.email),
        [user.email],
    );

    const form = useForm<z.infer<typeof DeleteSchema>>({
        resolver: zodResolver(DeleteSchema),
        defaultValues: { confirm: "" },
        mode: "onTouched",
    });

    async function onSubmit(_: z.infer<typeof DeleteSchema>) {
        await authClient.deleteUser();
        await authClient.signOut?.();
        toast.success("Account deleted");
        redirect("/");
    }

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Danger zone</CardTitle>
                <CardDescription>
                    Delete your account and all associated data.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Alert variant="destructive">
                    <AlertDescription>
                        This action is irreversible. Please proceed with
                        caution.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="justify-between">
                <div className="text-sm text-muted-foreground">
                    Youll be signed out immediately after deletion.
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete account?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. All maps and data
                                associated with your account will be permanently
                                deleted. Type your email to confirm.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid gap-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="confirm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        user.email ??
                                                        "your email"
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Permanently delete
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
