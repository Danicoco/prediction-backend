/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IWithdrawal } from "../../types"


const WithdrawalSchema: Schema = new Schema<IWithdrawal>(
    {
        user: { type: "String", required: true, ref: "User" },
        amount: { type: "Number", required: true },
        meta: { type: "Map", },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "withdrawals",
    }
)

WithdrawalSchema.set("timestamps", true)
WithdrawalSchema.plugin(mongoosePagination)
WithdrawalSchema.index({ "user": 1 })

const WithdrawalModel = db.model<IWithdrawal, Pagination<IWithdrawal>>(
    "Withdrawal",
    // @ts-ignore
    WithdrawalSchema
)

export default WithdrawalModel
