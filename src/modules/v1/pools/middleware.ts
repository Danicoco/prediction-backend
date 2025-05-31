/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import PoolService from "./service"
import { debitWallet } from "../wallets/helper"
import { db } from "../../../databases/connection"

export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, config } = req.body
    try {
        const [pool, error] = await tryPromise(
            new PoolService({ name }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (pool) throw catchError("Name already taken. Use another name", 400)

        if (config.paid && config.amount) {
            const session = await db.startSession()
            await session.withTransaction(async () => {
                await debitWallet({
                    userId: String(req.user),
                    session: session,
                    amount: config.amount,
                    isWithdrawal: false,
                    pendingTransaction: false,
                    transactionMeta: { pool: name, action: "create pool" },
                })
            })
        }

        return next()
    } catch (error) {
        next(error)
    }
}
