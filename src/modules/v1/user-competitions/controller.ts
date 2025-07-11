/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import UserCompetitionService from "./service"
import CompetitionService from "../competitions/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { competitionId } = req.body;
    try {
        const [userComp, comp] = await Promise.all([
            new UserCompetitionService({ competition: competitionId }).findOne(),
            new CompetitionService({ _id: competitionId }).findOne(),
        ])
        if (userComp) throw catchError("Competition added already");
        if (!comp) throw catchError("Invalid competition");

        await new UserCompetitionService({}).create({
            ...comp,
            user: String(req.user._id),
            competition: String(comp._id)
        })

        return res.status(200).json(
            success("Competition add", {})
        )
    } catch (error) {
        next(error);
    }
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.user;
    try {
        const [userCompetitions, error] = await tryPromise(
            new UserCompetitionService({ user: String(_id) }).findAll({}, 1, 50)
        )

        const userCompIds = userCompetitions?.docs?.map(doc => doc.competition);

        const [allComps, compErr] = await tryPromise(
            new CompetitionService({ default: true }).findAll({
                $or: [
                    { _id: { $in: userCompIds } },
                    { default: true }
                ]
            })
        )

        if (error) throw catchError("Error processing request")
        if (compErr) throw catchError("Error processing request")                

        return res.status(200).json(success("User Competitions retrieved successfully", allComps))
    } catch (error) {
        next(error)
    }
}
