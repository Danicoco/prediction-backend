/** @format */

import { IPrediction } from "../../../types"
import { PredictionModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PredictionService extends BaseRepository<IPrediction> {
    constructor(params: Partial<IPrediction> | FilterQuery<IPrediction>) {
        super(PredictionModel, params)
    }
}

export default PredictionService
