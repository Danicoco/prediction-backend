/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import CompetitionService from "./service"
import FootballData from "../../thirdpartyApi/football"
import News from "../../thirdpartyApi/news"

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
                filters: [] as any,
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

export const addFilters = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { filters = [] } = req.body;
    try {
        const [competition, error] = await tryPromise(
            new CompetitionService({ _id: req.params.id }).findOne()
        )

        if (error) throw catchError("Error processing request")

        if (!competition) throw catchError("Invalid competition")

        const newFilters = [...(competition.filters || []), ...filters].filter(
            (item, index, self) =>
              index === self.findIndex(other => other.value === item.value)
          ) as [{ name: string, value: string }];

        await new CompetitionService({ _id: competition._id }).update({
            filters: newFilters
        })

        return res
            .status(200)
            .json(success("Competition defaulted successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const getNews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    const news = await new News().getFootballNews();

    return res.status(200).json(
        success("News retrieved", news)
    )
    } catch (error) {
        next(error);
    }
}
