/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import MatchService from "./service"
import { matchPipeline } from "./helper"
import FootballData from "../../thirdpartyApi/football"
import CompetitionService from "../competitions/service"
import { endOfWeek, format, startOfWeek } from "date-fns"



const getMatchWeek = async (query: Record<string, string>) => {
    const { competition, userId } = query
    
    let result
    const [matches, error] = await tryPromise(
        new MatchService({}).aggregate(matchPipeline(query, userId))
    )
    console.log({ matches })
    if (error) throw catchError("Error processing request")
    result = matches || []
    if (!matches?.length) {
        const comp = await new CompetitionService({
            _id: competition,
        }).findOne()

        if (!comp) throw catchError("Error processing request", 400)
        const date = {
            dateFrom: format(startOfWeek(new Date()), "yyyy-MM-dd"),
            dateTo: format(endOfWeek(new Date()), "yyyy-MM-dd"),
        }
        const matchQuery = await new FootballData().getCompetitionMatches(
            comp.code,
            { ...date }
        )

        const newMatches = matchQuery.map(match => ({
            status: match.status.toLowerCase(),
            homeTeam: {
                name: match.homeTeam.name,
                shortName: match.homeTeam.shortName,
                crest: match.homeTeam.crest,
                score: match.score.fullTime.home,
            },
            awayTeam: {
                name: match.awayTeam.name,
                shortName: match.awayTeam.shortName,
                crest: match.awayTeam.crest,
                score: match.score.fullTime.away,
            },
            matchday: String(match.matchday),
            date: new Date(match.utcDate),
            competition: competition,
            stage: match.stage,
        }))
        result = await new MatchService({}).bulkCreate(newMatches)
    }
    return result
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log({ ...req.query })
        const result = await getMatchWeek({
            ...req.query,
            userId: req.user._id,
        } as Record<string, string>)

        return res
            .status(200)
            .json(success("Match retrieved successfully", result))
    } catch (error) {
        next(error)
    }
}
