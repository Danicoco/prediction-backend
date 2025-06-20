/** @format */

import { endOfDay, startOfDay } from "date-fns"

export const leaderboardPipeline = (
    competition: string,
    userIds = [],
    fromDate: string,
    toDate: string
) => [
    {
        $match: {
            ...(userIds.length && {
                _id: { $in: userIds },
            }),
        },
    },
    {
        $limit: 50,
    },
    {
        $lookup: {
            let: {
                userId: { $toString: "$_id" },
            },
            from: "predictions",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$user", "$$userId"] },
                                {
                                    ...(competition && {
                                        $eq: ["$competition", competition],
                                    }),
                                    ...(fromDate &&
                                        toDate && {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$createdAt",
                                                        startOfDay(
                                                            new Date(fromDate)
                                                        ),
                                                    ],
                                                },
                                                {
                                                    $gte: [
                                                        "$createdAt",
                                                        endOfDay(
                                                            new Date(toDate)
                                                        ),
                                                    ],
                                                },
                                            ],
                                        }),
                                },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$user",
                        totalPoints: { $sum: "$point" },
                    },
                },
            ],
            as: "predictions",
        },
    },
    {
        $addFields: {
            predictions: {
                $ifNull: [
                    { $arrayElemAt: ["$predictions", 0] },
                    { _id: null, totalPoints: 0 },
                ],
            },
        },
    },
    {
        $sort: {
            "predictions.totalPoints": -1,
        },
    },
]
