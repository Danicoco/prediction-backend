import { Request } from "express";
import { ITransaction } from "../../../types";
import { randomInt } from "crypto";

export const composeFilter = (req: Request) => {
    const { 
        user,
            amount,
            wallet,
            status,
            type,
            reference,
            currency,
            isAdmin
     } = req.query;
    let filter = {}

    if (!isAdmin) filter = { ...filter, user: req.user._id };
    if (user) filter = { ...filter, user };
    if (type) filter = { ...filter, type };
    if (currency) filter = { ...filter, currency };
    if (reference) filter = { ...filter, reference };
    if (wallet) filter = { ...filter, wallet };
    if (status) filter = { ...filter, status };
    if (amount) filter = { ...filter, amount };

    return filter;
}

const transactionReference = `ONE-${randomInt(1000,9999)}-${new Date().getTime()}`

export const composeTransactionDoc = (params: Record<string, any>): ITransaction => {
    return {
        user: params.user || params.userId || params.wallet.user,
        fee: params.fee || 0,
        amount: Number(params.amount),
        wallet:  params.wallet._id || params.wallet,
        status: params.status || "pending",
        type: params.type || "debit",
        reference: transactionReference,
        currency: params.currency || "NGN",
        dateInitiated: new Date(),
        meta: params.meta
    }
}

export const logChanges = async (payload: any) => {
    console.log({ payload }, "for transaction")
}