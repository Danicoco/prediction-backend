/** @format */

import { addMonths, endOfWeek, startOfWeek } from "date-fns"

export const composeFilter = (query: Record<string, string>) => {
    const { competition, status, stage, matchday, date } = query
    let filter = {}

    if (date) {
        filter = {
            ...filter,
            date: {
                $gte: startOfWeek(new Date(date)),
                $lte: addMonths(endOfWeek(new Date()), 3),
            },
        }
    }
    if (competition) filter = { ...filter, competition }
    if (status) filter = { ...filter, status }
    if (matchday) filter = { ...filter, matchday }
    if (stage) filter = { ...filter, stage }

    return filter
}

export const matchPipeline = (
    query: Record<string, string>,
    userId: string,
) => {
    const filter = composeFilter(query)

    return [
        {
            $match: {
                ...filter,
                $and: [
                    { "awayTeam.score": { $eq: null } },
                    { "homeTeam.score": { $eq: null } },
                ]
            },
        },
        {
            $lookup: {
                let: {
                    userId: { $toString: userId },
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
        },
    ]
}

export const scorePipeline = (
    competition: string,
    userId: string,
) => {
    return [
        {
            $match: {
                competition,
                $and: [
                    { "awayTeam.score": { $ne: null } },
                    { "homeTeam.score": { $ne: null } },
                ]
            },
        },
        {
            $lookup: {
                let: {
                    userId: { $toString: userId },
                    competitionId: { $toString: competition },
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
        },
    ]
}