/** @format */
import { NextFunction, Request, Response } from "express"

import {
    catchError,
    createReference,
    success,
    tryPromise,
} from "../../common/utils"
import WalletService from "./service"
import { paystackCharge } from "../../common/utils/charges"
import UserService from "../users/service"
import { configs } from "../../common/utils/config"
import Paystack from "../../thirdpartyApi/paystack"
import { creditWallet } from "./helper"
import { db } from "../../../databases/connection"

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let result
        const [wallet, error] = await tryPromise(
            new WalletService({ user: String(req.user._id) }).findOne()
        )

        if (error) throw catchError("Error processing request", 500)

        result = wallet
        if (!wallet) {
            const [newWallet, newError] = await tryPromise(
                new WalletService({}).create({
                    user: String(req.user._id),
                    balance: 0,
                    currency: "NGN",
                })
            )
            if (newError) throw catchError("Error processing request", 500)
            result = newWallet
        }

        return res
            .status(200)
            .json(success("Account created successfully", { wallet: result }))
    } catch (error) {
        next(error)
    }
}

export const securePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, amount } = req.query

    const reference = createReference()

    const amountInKobo = Number(amount) * 100
    const calculateAmount = paystackCharge.calculateFundingAmount(amountInKobo)
    try {
        const user = await new UserService({ _id: id }).findOne()
        if (!user) throw catchError("Invalid Access", 400)

        console.log({ calculateAmount })

        return res.render("payment.ejs", {
            email: user.email,
            reference,
            customerId: String(id),
            amount: calculateAmount.totalFee,
            paymentType: "fund-account",
            phone: user.phoneNumber,
            base_url: configs.BACKEND_URL,
            fullName: `${user.firstName} ${user.lastName}`,
            key:
                configs.NODE_ENV === "production"
                    ? configs.PAYSTACK_PROD_PUBLIC
                    : configs.PAYSTACK_PUBLIC,
        })
    } catch (error) {
        next(error)
    }
}

export const webhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log({ header: req.headers })
        console.log(req.body)
        return res.status(200).json({ success: true })
    } catch (error) {
        next(error)
    }
}

export const verifyTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { reference } = req.body
    try {
        console.log({ reference })
        const trans = await new Paystack(reference).verifyTransaction()

        console.log({ trans })
        if (trans) {
            const session = await db.startSession()
            session.withTransaction(async () => {
                const r = await creditWallet({
                    userId: String(req.user._id),
                    session,
                    amount: Number(trans.amount / 100),
                    pendingTransaction: false,
                    transactionMeta: { ...trans },
                })
                console.log({ r })
            })
            await session.endSession()
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        next(error)
    }
}
