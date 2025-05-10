/** @format */

import { IPool } from "../../../types"
import { PoolModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PoolService extends BaseRepository<IPool> {
    constructor(params: Partial<IPool> | FilterQuery<IPool>) {
        super(PoolModel, params)
    }
}

export default PoolService
