/** @format */

import { IMatch } from "../../../types"
import { MatchModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class MatchService extends BaseRepository<IMatch> {
    constructor(params: Partial<IMatch> | FilterQuery<IMatch>) {
        super(MatchModel, params)
    }
}

export default MatchService
