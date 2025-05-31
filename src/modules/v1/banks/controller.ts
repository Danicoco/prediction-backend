/** @format */
import { NextFunction, Request, Response } from "express"

import { success } from "../../common/utils"
import Paystack from "../../thirdpartyApi/paystack"
import BankService from "./service";
import { bankList } from "../../common/utils/banks";

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name } = req.query;
    try {
        let banks

        if (name) {
            banks = bankList().filter(bank => bank.name.toLowerCase().includes(name as string))
        } else {
            banks = bankList();
        }

        return res
            .status(200)
            .json(success("Banks retrieved", banks))
    } catch (error) {
        next(error)
    }
}

export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bank = await new BankService({ user: String(req.user._id) }).findOne()

        return res
            .status(200)
            .json(success("Banks retrieved", bank))
    } catch (error) {
        next(error)
    }
}

export const verifyAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { accountNumber, bankCode } = req.body;
    try {
        const account = await new Paystack().verifyAccountDetails(accountNumber, bankCode);

        return res.status(200).json(
            success("Account details", account)
        )
    } catch (error) {
        next(error);
    }
}