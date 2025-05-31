/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IBank } from "../../types"


const BankSchema: Schema = new Schema<IBank>(
    {
        user: { type: "String", required: true, ref: "User" },
        accountName: { type: "String", required: true },
        accountNumber: { type: "String", required: true },
        bankCode: { type: "String", required: true },
        bankName: { type: "String", required: true },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "banks",
    }
)

BankSchema.set("timestamps", true)
BankSchema.plugin(mongoosePagination)
BankSchema.index({ "user": 1 })

const BankModel = db.model<IBank, Pagination<IBank>>(
    "Bank",
    // @ts-ignore
    BankSchema
)

export default BankModel
