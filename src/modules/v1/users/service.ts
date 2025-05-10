/** @format */

import { IUser } from "../../../types"
import { UserModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class UserService extends BaseRepository<IUser> {
    constructor(params: Partial<IUser> | FilterQuery<IUser>) {
        super(UserModel, params)
    }
}

export default UserService
