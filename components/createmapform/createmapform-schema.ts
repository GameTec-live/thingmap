"use client";
import { z } from "zod";

export const createmapformSchema = z.object({
    name: z.string().min(1, "Map name is required"),
    description: z.string().optional(),
    public: z.boolean(),
});
