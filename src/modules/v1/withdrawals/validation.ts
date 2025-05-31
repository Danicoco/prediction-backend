/** @format */

import { z } from "zod"

export const createSchema = z
    .object({
        amount: z.number({ required_error: "Enter amount" }),
        bankCode: z.string().optional(),
        accountNumber: z.string().optional(),
        accountName: z.string().optional(),
        bankName: z.string().optional(),
    })
    .strict()
