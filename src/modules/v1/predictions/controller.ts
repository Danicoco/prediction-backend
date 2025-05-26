/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success } from "../../common/utils"
import PredictionService from "./service"
import MatchService from "../matches/service"
import PoolMemberService from "../pool-members/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { homeTeamScore, awayTeamScore, pool, match } = req.body
    try {
        const [member, dbMatch, dbPrediction] = await Promise.all([
            new PoolMemberService({ pool, user: req.user._id }).findOne(),
            new MatchService({ _id: match }).findOne(),
            new PredictionService({ match, pool }).findOne()
        ])
        if (!member) throw catchError("You're not a member of this pool", 400);
        if (!dbMatch) throw catchError("Match does not exists", 400)
        if (dbPrediction?.point) throw catchError("Match already finished", 400);
        
        if (dbPrediction) {
            await new PredictionService({ _id: dbPrediction._id }).update({ homeTeamScore, awayTeamScore })
        } else {
            await new PredictionService({}).create({
                user: String(req.user._id),
                pool,
                match,
                awayTeamScore,
                homeTeamScore,
                point: 0
            })
        }

        return res.status(200).json(success("Prediction added successfully", {}))
    } catch (error) {
        next(error)
    }
}
