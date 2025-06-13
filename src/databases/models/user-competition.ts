/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IUserCompetition } from "../../types"


const CompetitionSchema: Schema = new Schema<IUserCompetition>(
    {
        name: { type: "String", required: true },
        code: { type: "String", required: true },
        type: { type: "String", required: true },
        user: { type: "String", required: true, ref: "User" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "user-competitions",
    }
)

CompetitionSchema.set("timestamps", true)
CompetitionSchema.plugin(mongoosePagination)
CompetitionSchema.index({ "user": 1 })

const CompetitionModel = db.model<IUserCompetition, Pagination<IUserCompetition>>(
    "UserCompetition",
    // @ts-ignore
    CompetitionSchema
)

export default CompetitionModel
