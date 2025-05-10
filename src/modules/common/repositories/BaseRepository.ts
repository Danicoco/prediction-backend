/** @format */

import { ClientSession, FilterQuery, Model, PopulateOptions, QueryOptions } from "mongoose"
import { IPaginateResponse, IPaginator } from "../../../types"

class BaseRepository<T> {
    protected model = Model

    private finderOptions: Partial<T>

    private composeFinder(params: Partial<T>) {
        const isValidValue = (value: string) =>
            value !== "" && value !== undefined

        Object.entries(params).forEach(([key, value]) => {
            if (!isValidValue(value as string)) {
                // @ts-ignore
                delete params[key]
            }
        })

        return params
    }

    constructor(model: Model<T>, finderOptions: Partial<T>) {
        this.model = model
        this.finderOptions = this.composeFinder(finderOptions)
    }

    public async create(params: T, session?: ClientSession): Promise<T> {
        const data = await new this.model(params).save({
            ...(session && { session }),
        })
        return data
    }

    public async bulkCreate(
        params: Array<T>,
        session?: ClientSession
    ): Promise<T[]> {
        const data = await this.model.insertMany(params, {
            ...(session && { session }),
        })
        return data
    }

    public async update(
        param: Partial<T>,
        session?: ClientSession
    ): Promise<T> {
        const data = await this.model.findOneAndUpdate(
            this.finderOptions,
            param,
            {
                new: true,
                lean: true,
                ...(session && { session }),
            }
        )
        return data
    }

    public async updateMany(param: Partial<T>, session?: ClientSession) {
        const data = await this.model.updateMany(this.finderOptions, param, {
            new: true,
            ...(session && { session }),
        })
        return data
    }

    public async bulkWrite(param: any[], session?: ClientSession) {
        const data = await this.model.bulkWrite(param, { session })
        return data
    }

    public async findOne(options: QueryOptions = {}): Promise<T | null> {
        const data = await this.model.findOne(
            { ...this.finderOptions },
            {},
            { lean: true, sort: { createdAt: -1 }, ...options }
        )
        return data
    }

    public async count(): Promise<number> {
        const data = await this.model.countDocuments(
            { ...this.finderOptions },
        )
        return data
    }

    public async deleteOne(session?: ClientSession): Promise<T | null> {
        const data = await this.model.findOneAndUpdate(
            this.finderOptions,
            { deletedAt: new Date().toISOString() },
            {
                ...(session && { session }),
            }
        )
        return data
    }

    public async findAll(
        params: Partial<T> | FilterQuery<T>,
        page = 1,
        limit = 10,
        populate?: PopulateOptions[] | PopulateOptions
    ): Promise<IPaginateResponse<T>> {
        return this.paginate({
            query: { ...params, deletedAt: null },
            limit,
            page,
            populate,
        })
    }

    private async paginate(params: IPaginator<Partial<T>>) {
        const query = { ...params, sort: { createdAt: -1 }, key: "_id" }
        // @ts-ignore
        return this.model.paginate(query)
    }
}

export default BaseRepository
