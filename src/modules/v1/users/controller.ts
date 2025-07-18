/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import { composeFilter } from "./helper"
import UserService from "./service"
import { decrytData, encryptData } from "../../common/hashings"
import { addHours } from "date-fns"
import { randomInt } from "crypto"
import { db } from "../../../databases/connection"
import { getGeneralPool } from "../pools/helper"
import PoolMemberService from "../pool-members/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const otp = randomInt(1000, 9999)
        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [user, crtError] = await tryPromise(
                new UserService({}).create({
                    ...req.body,
                    otp,
                    password: encryptData(req.body.password),
                })
            )

            if (crtError) throw catchError("An error occurred! Try again", 400)
            const [pool, plErr] = await tryPromise(getGeneralPool())
            if (plErr) throw catchError("An error occurred! Try again", 400)
            await new PoolMemberService({}).create({
                pool: String(pool?._id),
                user: String(user?._id),
                gameWeeksParticipated: [],
                totalAmountSpent: 0,
                status: "approved",
                type: "player",
            })
        })

        return res
            .status(201)
            .json(success("Account created successfully", {}, {}))
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { to, password } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                $or: [{ phoneNumber: to }, { email: to }],
                isActive: true,
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)

        if (!user) throw catchError("Email/Password is incorrect", 404)
        if (!user.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (decrytData(user.password) !== password)
            throw catchError("Email/Password is incorrect", 400)

        const token = encryptData(
            JSON.stringify({ _id: user._id, exp: addHours(new Date(), 48) })
        )

        return res
            .status(200)
            .json(
                success(
                    "Logged In successfully",
                    { verificationStatus: !!user.verifiedAt },
                    { token }
                )
            )
    } catch (error) {
        next(error)
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [user, error] = await tryPromise(
            new UserService({ _id: req.params.id || req.user._id }).update(
                req.body
            )
        )

        if (error) throw catchError("Error processing request", 400)

        const token = encryptData(
            JSON.stringify({ _id: user?._id, exp: addHours(new Date(), 48) })
        )

        return res
            .status(200)
            .json(success("Account updated successfully", { token }))
    } catch (error) {
        next(error)
    }
}

export const profile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user
    try {
        const excludeFields = ["password", "otp", "promo", "nin"]
        const result = Object.keys(user).reduce((acc, curr) => {
            if (!excludeFields.includes(curr)) {
                // @ts-ignore
                acc[curr] = user[curr]
            }
            return acc
        }, {})

        return res
            .status(200)
            .json(success("Account retrieved successfully", result))
    } catch (error) {
        next(error)
    }
}

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user
    try {
        await new UserService({ _id: user._id }).update({ isActive: false })

        return res.status(200).json(success("Account deleted successfully", {}))
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
            new UserService({}).findAll(
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
