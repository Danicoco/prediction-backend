/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import PoolMemberService from "./service"
import { composeFilter } from "./helper"
import PoolService from "../pools/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { pool } = req.body;
    try {
        const [_, crtError] = await tryPromise(
            new PoolMemberService({}).create({
                pool,
                user: String(req.user._id),
                totalAmountSpent: 0,
                gameWeeksParticipated: [],
                status: 'pending'
            })
        )

        if (crtError) throw catchError("An error occurred! Try again", 400)

        return res
            .status(201)
            .json(success("Pool joined successfully", {}, {  }))
    } catch (error) {
        next(error)
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { poolId, status } = req.body;
    try {
        const [pool, err] = await tryPromise(
            new PoolService({ _id: poolId }).findOne()
        );

        if (err) throw catchError("There was an error", 400);
        if (!pool) throw catchError("This pool no longer exist", 404);

        const [_, crtError] = await tryPromise(
            new PoolMemberService({ _id: req.params._id }).update({
                status
            })
        )

        if (crtError) throw catchError("An error occurred! Try again", 400)

        return res
            .status(200)
            .json(success("Pool updated successfully", {}, {  }))
    } catch (error) {
        next(error)
    }
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit } = req.query
    try {
        const [users, error] = await tryPromise(
            new PoolMemberService({}).findAll(
                composeFilter(req),
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Errors retrieving users", 400)

        return res.status(200).json(success("Users retrieved", users))
    } catch (error) {
        next(error)
    }
}
