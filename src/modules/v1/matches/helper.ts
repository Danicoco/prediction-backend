/** @format */

import { endOfWeek, startOfWeek } from "date-fns"

export const composeFilter = (query: Record<string, string>) => {
    const { competition, status, stage, matchday } = query
    let filter = {
        date: {
            $gte: startOfWeek(new Date()),
            $lte: endOfWeek(new Date()),
        },
    } as any

    if (competition) filter = { ...filter, competition }
    if (status) filter = { ...filter, status }
    if (matchday) filter = { ...filter, matchday }
    if (stage) filter = { ...filter, stage }

    return filter
}

export const matchPipeline = (
    query: Record<string, string>,
    pool: string,
    userId: string
) => {
    const filter = composeFilter(query);
    console.log({ filter });
    return [
        {
            $match: {
                ...filter,
            },
        },
        {
            $lookup: {
                let: {
                    userId: { $toString: userId },
                    poolId: { $toString: pool },
                    competitionId: { $toString: query.competition },
                    matchId: { $toString: "$_id" },
                },
                from: "predictions",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$user", "$$userId"] },
                                    { $eq: ["$match", "$$matchId"] },
                                    { $eq: ["$pool", "$$poolId"] },
                                    {
                                        $eq: [
                                            "$competition",
                                            "$$competitionId",
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: "prediction",
            },
        }
    ]
}
