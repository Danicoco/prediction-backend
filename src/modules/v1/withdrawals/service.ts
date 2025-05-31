/** @format */

import { IWithdrawal } from "../../../types"
import { WithdrawalModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class WithdrawalService extends BaseRepository<IWithdrawal> {
    constructor(params: Partial<IWithdrawal> | FilterQuery<IWithdrawal>) {
        super(WithdrawalModel, params)
    }
}

export default WithdrawalService
