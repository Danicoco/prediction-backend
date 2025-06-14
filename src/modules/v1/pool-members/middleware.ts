/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import { debitWallet } from "../wallets/helper"
import { db } from "../../../databases/connection"
import PoolService from "../pools/service"
import PoolMemberService from "./service"

export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { poolId } = req.body
    try {
        const [member, err] = await tryPromise(
            new PoolMemberService({ user: String(req.user._id), pool: poolId }).findOne()
        )
        
        if (err) throw catchError("Error processing request", 400);
        if (member) throw catchError("You already joined this pool", 400);
        
        const [pool, error] = await tryPromise(
            new PoolService({ _id: poolId }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!pool) throw catchError("Pool does not exist", 400)
            if (!pool.isActive) throw catchError("Pool have been closed", 400);

        if (pool.config.paid && pool.config.amount) {
            const session = await db.startSession()
            await session.withTransaction(async () => {
                debitWallet({
                    userId: String(req.user._id),
                    session: session,
                    amount: pool.config.amount,
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
