/** @format */

import { ICompetition } from "../../../types"
import { CompetitionModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class CompetitionService extends BaseRepository<ICompetition> {
    constructor(params: Partial<ICompetition> | FilterQuery<ICompetition>) {
        super(CompetitionModel, params)
    }
}

export default CompetitionService
