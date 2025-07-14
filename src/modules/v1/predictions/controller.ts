/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import PredictionService from "./service"
import MatchService from "../matches/service"
import { leaderboardPipeline } from "./helper"
import UserService from "../users/service"
import PoolMemberService from "../pool-members/service"
import { addMinutes, getMinutes, isAfter } from "date-fns"
import agenda from "../../common/queue/agenda"
import { agendaIdentifier } from "../../common/queue/identifiers"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { homeTeamScore, awayTeamScore, pool, match, competition } = req.body
    try {
        const [dbMatch, dbPrediction] = await Promise.all([
            new MatchService({ _id: match }).findOne(),
            new PredictionService({ match, pool }).findOne(),
        ])

        if (!dbMatch) throw catchError("Match does not exists", 400)
        if (dbPrediction?.point) throw catchError("Match already finished", 400)

        let prediction = dbPrediction;

        // check if data has passed
        if (isAfter(new Date(), new Date(dbMatch.date)))
            throw catchError("Match is currently in progress", 400)

        if (dbPrediction) {
            prediction = await new PredictionService({ _id: dbPrediction._id }).update({
                homeTeamScore,
                awayTeamScore,
            })
        } else {
            prediction = await new PredictionService({}).create({
                user: String(req.user._id),
                pool,
                match,
                awayTeamScore,
                homeTeamScore,
                point: 0,
                competition,
            })
        }

        const minutes = getMinutes(addMinutes(new Date(dbMatch.date), 100))
        await agenda.schedule(`in ${minutes} minutes`, agendaIdentifier.CALCULATE_PREDICTION, { prediction })

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
    const { competition, fromDate, toDate, poolId } = req.query
    try {
        let userIds: string[] = []
        if (poolId) {
            const [members, error] = await tryPromise(
                new PoolMemberService({}).findAll({
                    pool: poolId,
                    status: "approved",
                })
            )

            if (error) throw catchError("Error processing request", 400)
            const memberIds = members?.docs.map(doc => doc.user) || []
            userIds = memberIds
        }
        console.log({ userIds, poolId })
        const leaderboard = await new UserService({}).aggregate(
            // @ts-ignore
            leaderboardPipeline(
                competition as string,
                userIds,
                fromDate as string,
                toDate as string
            )
        )

        return res
            .status(200)
            .json(success("Leaderboard retrieved", leaderboard))
    } catch (error) {
        next(error)
    }
}

export const applicationInReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { competition, fromDate, toDate, poolId } = req.query
    try {
        const [members, error] = await tryPromise(
            new PoolMemberService({}).findAll({
                pool: poolId,
                status: "pending",
            })
        )

        if (error) throw catchError("Error processing request", 400)
        const memberIds = members?.docs.map(doc => doc.user)

        const leaderboard = await new UserService({}).aggregate(
            // @ts-ignore
            leaderboardPipeline(
                competition as string,
                memberIds,
                fromDate as string,
                toDate as string
            )
        )

        return res
            .status(200)
            .json(success("Leaderboard retrieved", leaderboard))
    } catch (error) {
        next(error)
    }
}
