/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import PoolService from "./service"
import { encryptData } from "../../common/hashings"
import { composeFilter, generateInviteCode } from "./helper"
import { db } from "../../../databases/connection"
import PoolMemberService from "../pool-members/service"
import { debitWallet } from "../wallets/helper"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const code = generateInviteCode()
        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [newPool, crtError] = await tryPromise(
                new PoolService({}).create(
                    {
                        ...req.body,
                        config: {
                            ...req.body.config,
                            code,
                        },
                        createdBy: req.user._id,
                        totalMembers: 1,
                        password: encryptData(req.body.password),
                    },
                    session
                )
            )

            if (crtError) throw catchError("An error occurred! Try again", 400)

            if (Number(req.body.config.amount)) {
                await debitWallet({
                    userId: String(req.user._id),
                    session,
                    amount: Number(req.body.config.amount),
                    isWithdrawal: false,
                    pendingTransaction: false,
                    transactionMeta: { ...req.body, action: "Create Pool" },
                })
            }
            await new PoolMemberService({}).create(
                {
                    pool: String(newPool?._id),
                    user: String(req.user._id),
                    gameWeeksParticipated: [],
                    totalAmountSpent: req.body.config.amount,
                    status: "approved" as any,
                },
                session
            )
        })

        return res
            .status(201)
            .json(success("Account created successfully", {}, {}))
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
