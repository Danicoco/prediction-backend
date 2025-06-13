/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import CompetitionService from "./service"
import FootballData from "../../thirdpartyApi/football"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let result
        const [competitions, error] = await tryPromise(
            new CompetitionService({}).findAll({}, 1, 20)
        )

        if (error) throw catchError("Error processing request")

        result = competitions?.docs
        if (!competitions?.docs.length) {
            const supportedCompetitions =
                await new FootballData().getCompetitions()
            const newCompetitions = supportedCompetitions.map(competition => ({
                name: competition.name,
                type: competition.type,
                code: competition.code,
                default: false,
            }))
            result = await new CompetitionService({}).bulkCreate(
                newCompetitions
            )
        }

        return res
            .status(200)
            .json(success("Competition retrieved successfully", result))
    } catch (error) {
        next(error)
    }
}

export const makeDefault = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [competition, error] = await tryPromise(
            new CompetitionService({ code: req.params.code }).findOne()
        )

        if (error) throw catchError("Error processing request")

        if (!competition) throw catchError("Invalid competition")

        await new CompetitionService({ _id: competition._id }).update({
            default: true,
        })

        return res
            .status(200)
            .json(success("Competition defaulted successfully", {}))
    } catch (error) {
        next(error)
    }
}
