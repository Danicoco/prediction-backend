/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPool } from "../../types"

const configSchema = new Schema(
    {
        amount: { type: "Number", required: true },
        paid: { type: "Boolean", required: true },
        poolSharing: { type: "String", required: true }
    })

const PoolSchema: Schema = new Schema<IPool>(
    {
        createdBy: { type: "String", required: true, ref: "User" },
        name: { type: "String", required: true, unique: true },
        description: { type: "String", },
        totalMembers: { type: "Number", },
        config: { type: configSchema, required: true },
        isActive: { type: "Boolean", default: true },
        privacy: { type: "String", enum: ['Public', 'Private'] },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "pools",
    }
)

PoolSchema.set("timestamps", true)
PoolSchema.plugin(mongoosePagination)
PoolSchema.index({ "name": 1, createdBy: 1, privacy: 1 })

const PoolModel = db.model<IPool, Pagination<IPool>>(
    "Pool",
    // @ts-ignore
    PoolSchema
)

export default PoolModel
