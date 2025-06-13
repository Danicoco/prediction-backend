/** @format */

import { IUserCompetition } from "../../../types"
import { UserCompetitionModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class UserCompetitionService extends BaseRepository<IUserCompetition> {
    constructor(params: Partial<IUserCompetition> | FilterQuery<IUserCompetition>) {
        super(UserCompetitionModel, params)
    }
}

export default UserCompetitionService
