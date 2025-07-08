/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPoolMember } from "../../types"

const PoolMemberSchema: Schema = new Schema<IPoolMember>(
    {
        user: { type: "String", required: true, ref: "User" },
        pool: { type: "String", required: true, ref: "Pool" },
        gameWeeksParticipated: { type: ["String"], },
        totalAmountSpent: { type: "Number", default: 0 },
        status: { type: "String", default: "pending" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "poolMembers",
    }
)

PoolMemberSchema.set("timestamps", true)
PoolMemberSchema.plugin(mongoosePagination)
PoolMemberSchema.index({ "user": 1, pool: 1 })

const PoolMemberModel = db.model<IPoolMember, Pagination<IPoolMember>>(
    "PoolMember",
    // @ts-ignore
    PoolMemberSchema
)

export default PoolMemberModel
