/** @format */

import { Request } from "express"
import { PopulateOptions } from "mongoose"

interface DefaultAttributes {
    _id?: string
    deletedAt?: string
    createdAt?: string
    updatedAt?: string
}

interface IUser extends DefaultAttributes {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phoneNumber: string;
    dateOfBirth: Date;
    password: string;
    verifiedAt: Date;
    otp: string;
    isActive: boolean;
    avatar: string;
}

interface IWallet extends DefaultAttributes {
    user: string;
    balance: number;
    currency: string;
    dateOfLastTopUp?: Date;
}

interface IPin extends DefaultAttributes {
    code: string;
    user: string;
    attemptLeft: number;
    lastChangedAt: Date;
}

type TransactionStatus = 'pending' | 'successful' | 'failed'
type TransactionType = 'credit' | 'debit'

interface ITransaction extends DefaultAttributes {
    user: string;
    fee: number;
    amount: number;
    wallet: string;
    status: TransactionStatus;
    type: TransactionType;
    reference: string;
    currency: string;
    wasReverted?: boolean
    wasRefunded?: boolean
    dateReverted?: Date
    dateRefunded?: Date
    dateInitiated: Date
    dateCompleted?: Date
    meta?: Record<string, any>
}

interface IPool extends DefaultAttributes {
    name: string;
    description: string;
    privacy: "Public" | "Private"
    config: {
        amount: number;
        paid: boolean;
        poolSharing: 'first-take-all' | 'top-three'
    }
    totalMembers: number;
    isActive: boolean;
    createdBy: string;
}

type GameWeek = { week: number; point: number }

interface IPoolMember extends DefaultAttributes {
    pool: string;
    user: string;
    gameWeeksParticipated: GameWeek[]
    totalAmountSpent: number;
}

interface IPaginator<T> {
    query?: T
    page: number
    limit: number
    select?: string
    populate?: PopulateOptions[] | PopulateOptions
}

type IPaginateResponse<T> = {
    docs: T[]
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
    hasMore: boolean
    totalDocs: number
    page: number
    totalPages: number
}


type CreateErr = (message: string, code?: number, validations?: object) => Error

type Token = IUser & { time: Date };

declare module "express-serve-static-core" {
    export interface Request {
        user: IUser
    }
}

type AppError = Error & {
    code: number
    name?: string
    message: string
    validations?: object | null
}

type Fix = any
