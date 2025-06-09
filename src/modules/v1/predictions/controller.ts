/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success } from "../../common/utils"
import PredictionService from "./service"
import MatchService from "../matches/service"
import PoolMemberService from "../pool-members/service"
import PoolService from "../pools/service"
import { leaderboardPipeline } from "./helper"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { homeTeamScore, awayTeamScore, pool, match, competition } = req.body
    try {
        const [dbPool, member, dbMatch, dbPrediction] = await Promise.all([
            new PoolService({ _id: pool }).findOne(),
            new PoolMemberService({ pool, user: req.user._id }).findOne(),
            new MatchService({ _id: match }).findOne(),
            new PredictionService({ match, pool }).findOne(),
        ])
        if (!dbPool) throw catchError("Pool does not exist", 400)
        // if (isAfter(new Date(), new Date(dbPool?.config.endDate))) throw catchError("Pool has ended.");
        if (!member && String(dbPool.createdBy) !== String(req.user._id))
            throw catchError("You're not a member of this pool", 400)
        if (!dbMatch) throw catchError("Match does not exists", 400)
        if (dbPrediction?.point) throw catchError("Match already finished", 400)

        if (dbPrediction) {
            await new PredictionService({ _id: dbPrediction._id }).update({
                homeTeamScore,
                awayTeamScore,
            })
        } else {
            await new PredictionService({}).create({
                user: String(req.user._id),
                pool,
                match,
                awayTeamScore,
                homeTeamScore,
                point: 0,
                competition,
            })
        }

        return res
            .status(200)
            .json(success("Prediction added successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const leaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { competition, pool, fromDate, toDate } = req.query
    try {
        const leaderboard = await new PredictionService({}).aggregate(
            // @ts-ignore
            leaderboardPipeline(pool, competition as string, fromDate, toDate)
        )

        return res
            .status(200)
            .json(success("Leaderboard retrieved", leaderboard))
    } catch (error) {
        next(error)
    }
}
