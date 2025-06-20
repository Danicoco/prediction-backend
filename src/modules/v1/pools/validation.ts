/** @format */

import { z } from "zod"

export const basicUserValidation = z
    .object({
        email: z
            .string()
            .email({ message: "Provide a valid email" })
            .nonempty({ message: "Enter your email" })
            .trim()
            .toLowerCase(),
        password: z.string().nonempty({ message: "Password cannot be empty" }),
    })
    .required()
    .strict()

export const createSchema = z
    .object({
        name: z
            .string({ required_error: "Enter pool name" })
            .nonempty()
            .toLowerCase(),
        description: z
            .string({ required_error: "Describe your pool" })
            .nonempty(),
        privacy: z.string({ required_error: "Select Privacy" }).nonempty(),
        competition: z.string(),
        config: z.object({
            amount: z.number(),
            paid: z.boolean(),
            poolSharing: z.string(),
            endDate: z.string(),
        }).required()
    })
    .strict()

    export const fetchSchema = z
    .object({
        name: z.string().optional(),
        privacy: z.string().optional(),
        createdBy: z.string().optional(),
    })
    .strict()

