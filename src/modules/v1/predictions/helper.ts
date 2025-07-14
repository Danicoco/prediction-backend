/** @format */

import { endOfDay, startOfDay } from "date-fns"
import { Types } from "mongoose"

export const leaderboardPipeline = (
    competition: string,
    userIds = [] as string[],
    fromDate: string,
    toDate: string
) => [
    {
        $match: {
            ...(userIds.length && {
                _id: { $in: userIds.map(userId => new Types.ObjectId(userId)) },
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

export const calculatePredictionPoint = (
    homeScore: number,
    awayScore: number,
    predictedHomeScore: number,
    predictedAwayScore: number
) => {
    let point = 0;

    if (homeScore === predictedHomeScore && awayScore === predictedAwayScore) {
        point = 3;
    }

    

    return point;
}
