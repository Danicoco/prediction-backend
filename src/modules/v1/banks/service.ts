/** @format */

import { IBank } from "../../../types"
import { BankModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class BankService extends BaseRepository<IBank> {
    constructor(params: Partial<IBank> | FilterQuery<IBank>) {
        super(BankModel, params)
    }
}

export default BankService
