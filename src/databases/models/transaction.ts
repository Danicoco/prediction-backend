/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ITransaction } from "../../types"
import { logChanges } from "../../modules/v1/transactions/helper"

const TransactionSchema: Schema = new Schema<ITransaction>(
    {
        amount: { type: "Number", required: true },
        fee: { type: "Number", default: 0 },
        user: { type: "String", required: true, ref: "User" },
        wallet: { type: "String", required: true, ref: "Wallet" },
        status: { type: "String", default: "pending" },
        type: { type: "String", required: true },
        currency: { type: "String", default: "NGN" },
        reference: { type: "String", required: true },
        wasRefunded: { type: "Boolean" },
        wasReverted: { type: "Boolean" },
        dateCompleted: { type: "Date" },
        dateInitiated: { type: "Date" },
        dateRefunded: { type: "Date" },
        dateReverted: { type: "Date" },
        meta: { type: "Map" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "transactions",
    }
)

TransactionSchema.set("timestamps", true)
TransactionSchema.plugin(mongoosePagination)
TransactionSchema.index({ user: 1, wallet: 1, reference: 1 })

const TransactionModel = db.model<ITransaction, Pagination<ITransaction>>(
    "Transaction",
    // @ts-ignore
    TransactionSchema
)
TransactionModel.watch([], { fullDocument: "updateLookup" }).on("change", async (changeEvent) => logChanges(changeEvent));

export default TransactionModel
