/** @format */

import { IWallet } from "../../../types"
import { WalletModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class WalletService extends BaseRepository<IWallet> {
    constructor(params: Partial<IWallet> | FilterQuery<IWallet>) {
        super(WalletModel, params)
    }
}

export default WalletService
