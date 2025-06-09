import { endOfDay, startOfDay } from "date-fns";

export const leaderboardPipeline = (pool: string, competition: string, fromDate: string, toDate: string) => [
    {
      $match: {
        ...(pool && { pool }),
        ...(competition && {
            competition
        }),
        ...(fromDate && toDate && {
          createdAt: {
            $gte: startOfDay(new Date(fromDate)),
            $lte: endOfDay(new Date(toDate))
          }
        })
      }
    },
    {
      $group: {
        _id: "$user",
        totalPoints: { $sum: "$point" }
      }
    },
    {
      $sort: {
        totalPoints: -1
      }
    },
    {
      $lookup: {
        let: {
          userId: { $toObjectId: "$_id" }
        },
        from: "users",
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$userId"] }
                ]
              }
            }
          }
        ],
        as: "user"
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] }
      }
    }
  ]