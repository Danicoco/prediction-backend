/** @format */

import { ITransaction } from "../../../types"
import { TransactionModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class TransactionService extends BaseRepository<ITransaction> {
    constructor(params: Partial<ITransaction> | FilterQuery<ITransaction>) {
        super(TransactionModel, params)
    }
}

export default TransactionService
