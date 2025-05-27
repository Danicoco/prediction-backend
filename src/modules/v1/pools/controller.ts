/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import PoolService from "./service"
import { encryptData } from "../../common/hashings"
import { composeFilter } from "./helper"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [_, crtError] = await tryPromise(
            new PoolService({}).create({
                ...req.body,
                createdBy: req.user._id,
                totalMembers: 0,
                password: encryptData(req.body.password),
            })
        )

        if (crtError) throw catchError("An error occurred! Try again", 400)

        return res
            .status(201)
            .json(success("Account created successfully", {}, {  }))
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
        const [pools, error] = await tryPromise(
            new PoolService({}).findAll(
                composeFilter(req),
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Errors retrieving users", 400)

        return res.status(200).json(success("Users retrieved", pools))
    } catch (error) {
        next(error)
    }
}
