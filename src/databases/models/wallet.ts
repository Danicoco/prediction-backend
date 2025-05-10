/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IWallet } from "../../types"


const WalletSchema: Schema = new Schema<IWallet>(
    {
        user: { type: "String", required: true, ref: "User" },
        balance: { type: "Number", required: true, default: 0 },
        currency: { type: "String", default: "NGN", required: true },
        dateOfLastTopUp: { type: "String" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "wallets",
    }
)

WalletSchema.set("timestamps", true)
WalletSchema.plugin(mongoosePagination)
WalletSchema.index({ user: 1, })

const WalletModel = db.model<IWallet, Pagination<IWallet>>(
    "Wallet",
    // @ts-ignore
    WalletSchema
)

export default WalletModel
