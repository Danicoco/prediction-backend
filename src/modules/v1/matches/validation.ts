/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        competition: z
            .string({ required_error: "Enter competition" })
            .nonempty(),
        stage: z.string().optional(),
        state: z.string().optional(),
        pool: z.string().optional(),
    })
    .strict()
