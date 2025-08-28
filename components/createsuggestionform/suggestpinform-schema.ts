"use client";
import { z } from "zod";

export const suggestpinformSchema = z.object({
    title: z.string().min(1, "Pin title is required"),
    description: z.string().optional(),
    link: z.union([z.url().optional(), z.literal("")]),
    address: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
    isIssue: z.boolean(),
});
