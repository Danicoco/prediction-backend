/** @format */

import { IPoolMember } from "../../../types"
import { PoolMemberModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PoolMemberService extends BaseRepository<IPoolMember> {
    constructor(params: Partial<IPoolMember> | FilterQuery<IPoolMember>) {
        super(PoolMemberModel, params)
    }
}

export default PoolMemberService
