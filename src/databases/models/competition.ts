/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ICompetition } from "../../types"


const CompetitionSchema: Schema = new Schema<ICompetition>(
    {
        name: { type: "String", required: true },
        code: { type: "String", required: true },
        type: { type: "String", required: true },
        filters: { type: [{ name: "String", value: "String" }] },
        default: { type: "Boolean", default: false },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "competitions",
    }
)

CompetitionSchema.set("timestamps", true)
CompetitionSchema.plugin(mongoosePagination)
CompetitionSchema.index({ "user": 1 })

const CompetitionModel = db.model<ICompetition, Pagination<ICompetition>>(
    "Competition",
    // @ts-ignore
    CompetitionSchema
)

export default CompetitionModel
