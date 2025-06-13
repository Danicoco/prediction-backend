/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import MatchService from "./service"
import { matchPipeline } from "./helper"
import FootballData from "../../thirdpartyApi/football"
import CompetitionService from "../competitions/service"
import { endOfWeek, format, startOfWeek } from "date-fns"
import { IMatch } from "../../../types"

;(async () => {
    const clubWorldCupGroupStage: IMatch[] = [
        // Matchday 1
        {
            status: "scheduled",
            homeTeam: {
                name: "Al Ahly SC",
                shortName: "Al Ahly",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Inter Miami CF",
                shortName: "Inter Miami",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-14T20:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Bayern Munich",
                shortName: "Bayern",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Auckland City FC",
                shortName: "Auckland",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-15T12:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Paris Saint‑Germain",
                shortName: "PSG",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Atlético Madrid",
                shortName: "Atleti",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-15T12:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Palmeiras",
                shortName: "Palmeiras",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "FC Porto",
                shortName: "Porto",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-15T18:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Botafogo FR",
                shortName: "Botafogo",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Seattle Sounders FC",
                shortName: "Seattle",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-15T19:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Chelsea FC",
                shortName: "Chelsea",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Los Angeles FC",
                shortName: "LAFC",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-16T15:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Boca Juniors",
                shortName: "Boca",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Benfica",
                shortName: "Benfica",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-16T18:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Flamengo",
                shortName: "Flamengo",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Espérance de Tunis",
                shortName: "ES Tunis",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-16T21:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Fluminense",
                shortName: "Fluminense",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Borussia Dortmund",
                shortName: "Dortmund",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-17T12:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Ulsan Hyundai FC",
                shortName: "Ulsan HD",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Mamelodi Sundowns",
                shortName: "Sundowns",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-17T18:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "River Plate",
                shortName: "River Plate",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Urawa Red Diamonds",
                shortName: "Urawa",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-17T12:00:00Z"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Monterrey",
                shortName: "Monterrey",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Inter Milan",
                shortName: "Inter Milan",
                crest: "",
                score: null,
            },
            matchday: "1",
            date: new Date("2025-06-17T18:00:00Z"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        // Matchday 2
        {
            status: "scheduled",
            homeTeam: {
                name: "Palmeiras",
                shortName: "Palmeiras",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Al Ahly SC",
                shortName: "Al Ahly",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-19T12:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Inter Miami CF",
                shortName: "Inter Miami",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "FC Porto",
                shortName: "Porto",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-19T15:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Seattle Sounders FC",
                shortName: "Seattle",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Atlético Madrid",
                shortName: "Atleti",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-19T15:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Paris Saint‑Germain",
                shortName: "PSG",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Botafogo FR",
                shortName: "Botafogo",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-19T18:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Flamengo",
                shortName: "Flamengo",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Chelsea FC",
                shortName: "Chelsea",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-20T19:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Benfica",
                shortName: "Benfica",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Auckland City FC",
                shortName: "Auckland",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-20T18:00:00Z"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Ulsan Hyundai FC",
                shortName: "Ulsan HD",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Mamelodi Sundowns",
                shortName: "Sundowns",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-21T17:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Bayern Munich",
                shortName: "Bayern",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Boca Juniors",
                shortName: "Boca",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-21T02:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Fluminense",
                shortName: "Fluminense",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Ulsan HD FC",
                shortName: "Ulsan HD",
                crest: "",
                score: null,
            },
            matchday: "2",
            date: new Date("2025-06-21T23:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        // Matchday 3
        {
            status: "scheduled",
            homeTeam: {
                name: "Inter Miami CF",
                shortName: "Inter Miami",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Palmeiras",
                shortName: "Palmeiras",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-23T21:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "FC Porto",
                shortName: "Porto",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Al Ahly SC",
                shortName: "Al Ahly",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-23T21:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Seattle Sounders FC",
                shortName: "Seattle",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Paris Saint‑Germain",
                shortName: "PSG",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-23T12:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Atlético Madrid",
                shortName: "Atleti",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Botafogo FR",
                shortName: "Botafogo",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-23T12:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Auckland City FC",
                shortName: "Auckland",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Boca Juniors",
                shortName: "Boca",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-24T19:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Benfica",
                shortName: "Benfica",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Bayern Munich",
                shortName: "Bayern",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-24T20:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Los Angeles FC",
                shortName: "LAFC",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Flamengo",
                shortName: "Flamengo",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-25T02:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Espérance de Tunis",
                shortName: "ES Tunis",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Chelsea FC",
                shortName: "Chelsea",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-25T02:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Borussia Dortmund",
                shortName: "Dortmund",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Ulsan Hyundai FC",
                shortName: "Ulsan HD",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-25T20:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
        {
            status: "scheduled",
            homeTeam: {
                name: "Mamelodi Sundowns",
                shortName: "Sundowns",
                crest: "",
                score: null,
            },
            awayTeam: {
                name: "Fluminense",
                shortName: "Fluminense",
                crest: "",
                score: null,
            },
            matchday: "3",
            date: new Date("2025-06-25T20:00:00"),
            competition: "FIFA Club World Cup",
            stage: "Group Stage",
        },
    ]

    const matches = clubWorldCupGroupStage.map(stage => {
        return {
            status: stage.status,
            homeTeam: {
                name: stage.homeTeam.name,
                shortName: stage.homeTeam.shortName,
                crest: stage.homeTeam.crest || "https",
                score: null,
            },
            awayTeam: {
                name: stage.awayTeam.name,
                shortName: stage.awayTeam.shortName,
                crest: stage.awayTeam.crest || "https",
                score: null,
            },
            matchday: stage.matchday,
            date: new Date(stage.date),
            competition: "684c020762e5f81146ee918f",
            stage: stage.stage,
        }
    })
    await new MatchService({}).bulkCreate(matches)
})()

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
