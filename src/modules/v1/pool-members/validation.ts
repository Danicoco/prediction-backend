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
        pool: z.string({ required_error: "Enter pool name" }).nonempty(),
    })
    .strict()

export const fetchSchema = z
    .object({
        name: z.string().optional(),
        privacy: z.string().optional(),
        createdBy: z.string().optional(),
    })
    .strict()
