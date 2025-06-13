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
    firstName: string
    lastName: string
    email: string
    gender: string
    phoneNumber: string
    dateOfBirth: Date
    password: string
    verifiedAt: Date
    otp: string
    isActive: boolean
    avatar: string
}

interface IWallet extends DefaultAttributes {
    user: string
    balance: number
    currency: string
    dateOfLastTopUp?: Date
}

interface IPin extends DefaultAttributes {
    code: string
    user: string
    attemptLeft: number
    lastChangedAt: Date
}

type TransactionStatus = "pending" | "successful" | "failed"
type TransactionType = "credit" | "debit"

interface ITransaction extends DefaultAttributes {
    user: string
    fee: number
    amount: number
    wallet: string
    status: TransactionStatus
    type: TransactionType
    reference: string
    currency: string
    wasReverted?: boolean
    wasRefunded?: boolean
    dateReverted?: Date
    dateRefunded?: Date
    dateInitiated: Date
    dateCompleted?: Date
    meta?: Record<string, any>
}

interface IPool extends DefaultAttributes {
    name: string
    description: string
    privacy: "Public" | "Private"
    config: {
        amount: number
        paid: boolean
        poolSharing: "first-take-all" | "top-three"
        endDate: Date;
    }
    totalMembers: number
    competition: string;
    isActive: boolean
    createdBy: string
}

type GameWeek = { week: number; point: number }

interface IPoolMember extends DefaultAttributes {
    pool: string
    user: string
    gameWeeksParticipated: GameWeek[]
    totalAmountSpent: number
}

type Area = {
    id: number
    name: string
    code: string
    flag: string
}

type Season = {
    id: number
    startDate: string
    endDate: string
    currentMatchday: number
    winner: string
}

type ICompetitionResponse = {
    id: number
    area: Area
    name: string
    code: string
    type: "CUP" | "LEAGUE" | string
    emblem: string
    plan: "TIER_ONE" | "TIER_TWO" | "TIER_THREE" | "TIER_FOUR"
    currentSeason: Season
    numberOfAvailableSeasons: number
    lastUpdated: Date
}

interface Area {
    id: number
    name: string
    code: string
    flag: string
}

interface Competition {
    id: number
    name: string
    code: string
    type: "LEAGUE" | "CUP" | string // Add other possible competition types
    emblem: string
}

interface Season {
    id: number
    startDate: string // ISO 8601 date string
    endDate: string // ISO 8601 date string
    currentMatchday: number
    winner: null | { id: number; name: string } // Adjust based on actual winner data structure
}

interface Team {
    id: number
    name: string
    shortName: string
    tla: string // Three-letter abbreviation
    crest: string
}

interface Score {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null
    duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT" | string
    fullTime: {
        home: number
        away: number
    }
    halfTime: {
        home: number
        away: number
    }
}

interface Referee {
    id: number
    name: string
    // Add other referee properties if available
}

interface Match {
    id: number
    area: Area
    competition: Competition
    season: Season
    utcDate: string // ISO 8601 date-time string
    status:
        | "FINISHED"
        | "SCHEDULED"
        | "LIVE"
        | "IN_PLAY"
        | "PAUSED"
        | "POSTPONED"
        | "SUSPENDED"
        | "CANCELED"
    matchday: number
    stage:
        | "REGULAR_SEASON"
        | "GROUP_STAGE"
        | "LAST_16"
        | "QUARTER_FINALS"
        | "SEMI_FINALS"
        | "FINAL"
        | string
    group: null | string
    lastUpdated: string // ISO 8601 date-time string
    homeTeam: Team
    awayTeam: Team
    score: Score
    referees: Referee[]
}

interface ICompetition extends DefaultAttributes {
    name: string
    type: string
    code: string
    default: boolean;
}

interface IUserCompetition extends ICompetition {
    user: string
    competition: string;
}

interface IMatch extends DefaultAttributes {
    status: "ongoing" | "finished" | "scheduled" | string
    homeTeam: {
        name: string
        shortName: string
        crest: string
        score: number | null
    }
    awayTeam: {
        name: string
        shortName: string
        crest: string
        score: number | null
    }
    matchday: number;
    date: Date;
    competition: string;
    stage: string;
}

interface IPrediction extends DefaultAttributes {
    user: string;
    match: string;
    homeTeamScore: number;
    awayTeamScore: number;
    point: number;
    pool: string;
    competition: string;
}

interface IWithdrawal extends DefaultAttributes {
    user: string;
    amount: string;
    meta: Record<string, any>
}

interface IBank extends DefaultAttributes {
    user: string;
    bankName: string;
    bankCode: string;
    accountName: string;
    accountNumber: string;
}

type PaystackResponse = {
    status: boolean
    message: string
    data: PaystackResponseData
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

type Token = IUser & { time: Date }

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
