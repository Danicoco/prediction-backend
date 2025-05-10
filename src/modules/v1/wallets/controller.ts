/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import WalletService from "./service"

export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let result;
        const [wallet, error] = await tryPromise(
            new WalletService({ user: String(req.user._id) }).findOne()
        )

        if (error) throw catchError("Error processing request", 500);

        result = wallet
        if (!wallet) {
            const [newWallet, newError] = await tryPromise(
                new WalletService({}).create({ user: String(req.user._id), balance: 0, currency: 'NGN' })
            )
            if (newError) throw catchError("Error processing request", 500);
            result = newWallet
        }

        return res
            .status(200)
            .json(success("Account created successfully", { wallet: result }))
    } catch (error) {
        next(error)
    }
}
