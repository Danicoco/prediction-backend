/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IMatch } from "../../types"

const teamSchema: Schema = new Schema({
    name: { type: "String", required: true },
    shortName: { type: "String" },
    crest: { type: "String", required: true },
    score: { type: "Number", default: null },
})

const MatchSchema: Schema = new Schema<IMatch>(
    {
        status: { type: "String", required: true },
        matchday: { type: "String", required: true },
        date: { type: "Date", required: true },
        stage: { type: "String", required: true },
        homeTeam: { type: teamSchema, required: true },
        awayTeam: { type: teamSchema, required: true },
        competition: { type: "String", required: true, ref: "Competition" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "matches",
    }
)

MatchSchema.set("timestamps", true)
MatchSchema.plugin(mongoosePagination)
MatchSchema.index({ competition: 1, date: 1, matchday: 1 })
MatchSchema.index({ "homeTeam.name": 1, "awayTeam.name": 1 })

const MatchModel = db.model<IMatch, Pagination<IMatch>>(
    "Match",
    // @ts-ignore
    MatchSchema
)

export default MatchModel
