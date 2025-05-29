/** @format */

import { z } from "zod"

export const createSchema = z
    .object({
        pool: z.string({ required_error: "Enter pool id" }).nonempty(),
        match: z.string({ required_error: "Enter Match" }).nonempty(),
        competition: z.string({ required_error: "Enter Competition" }).nonempty(),
        homeTeamScore: z.number({ required_error: "Add Home Team Score" }),
        awayTeamScore: z.number({ required_error: "Add Away Team Score" }),
    })
    .strict()
