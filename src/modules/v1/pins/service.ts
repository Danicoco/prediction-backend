/** @format */

import { IPin } from "../../../types"
import { PinModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PinService extends BaseRepository<IPin> {
    constructor(params: Partial<IPin> | FilterQuery<IPin>) {
        super(PinModel, params)
    }
}

export default PinService
