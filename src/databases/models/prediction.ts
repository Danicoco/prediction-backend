/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPrediction } from "../../types"

const PredictionSchema: Schema = new Schema<IPrediction>(
    {
        user: { type: "String", required: true, ref: "User" },
        match: { type: "String", required: true, ref: "Match" },
        homeTeamScore: { type: "Number", required: true },
        awayTeamScore: { type: "Number", required: true },
        point: { type: "Number", required: true, default: 0 },
        pool: { type: "String" },
        competition: { type: "String", required: true, ref: "Competition" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "predictions",
    }
)

PredictionSchema.set("timestamps", true)
PredictionSchema.plugin(mongoosePagination)
PredictionSchema.index({ user: 1, pool: 1, match: 1 })

const PredictionModel = db.model<IPrediction, Pagination<IPrediction>>(
    "Prediction",
    // @ts-ignore
    PredictionSchema
)

export default PredictionModel
