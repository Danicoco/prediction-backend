/** @format */
import { NextFunction, Request, Response } from "express"

import { success } from "../../common/utils"
import BankService from "../banks/service"
import { db } from "../../../databases/connection"
import WithdrawalService from "./service"
import { debitWallet } from "../wallets/helper"
import { configs } from "../../common/utils/config"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { bankCode, accountNumber, accountName, bankName, amount } = req.body
    try {
        const bank = new BankService({ user: req.user._id }).findOne()

        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                session: session,
                amount,
                isWithdrawal: true,
                pendingTransaction: false,
                transactionMeta: {},
            })
            if (!bank) {
                await new BankService({}).create(
                    {
                        bankCode,
                        accountNumber,
                        accountName,
                        bankName,
                        user: String(req.user._id),
                    },
                    session
                )
            }
            if (configs.NODE_ENV === "production") {
                // await new Paystack()
            }
            await new WithdrawalService({}).create(
                {
                    amount,
                    meta: {},
                    user: String(req.user._id),
                },
                session
            )
        })
        await session.endSession()

        return res.status(200).json(success("Withdrawal sent successfully", {}))
    } catch (error) {
        next(error)
    }
}
