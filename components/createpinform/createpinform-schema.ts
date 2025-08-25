"use client";
import { z } from "zod";

export const createpinformSchema = z.object({
    title: z.string().min(1, "Pin title is required"),
    description: z.string().optional(),
    link: z.url().optional(),
    address: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
});
