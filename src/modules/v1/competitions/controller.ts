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
        
        result = competitions?.docs;
        if (!competitions?.docs.length) {
            const supportedCompetitions = await new FootballData().getCompetitions();
            const newCompetitions = supportedCompetitions.map(competition => ({ name: competition.name, type: competition.type, code: competition.code }));
            result = await new CompetitionService({}).bulkCreate(newCompetitions);
        }

        return res.status(200).json(success("Competition retrieved successfully", result))
    } catch (error) {
        next(error)
    }
}
