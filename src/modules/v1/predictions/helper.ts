export const leaderboardPipeline = (pool: string, competition?: string) => [
    {
      $match: {
        pool,
        ...(competition && {
            competition
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