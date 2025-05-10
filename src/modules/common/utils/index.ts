/** @format */

import { Schema } from "zod"
import { format, isAfter } from "date-fns"
import { NextFunction, Response, Request } from "express"

import { IUser, AppError, CreateErr, Token } from "../../../types"
import { decrytData, encryptData } from "../hashings"
import { validationResult } from "express-validator"
import UserService from "../../v1/users/service"

export const catchError: CreateErr = (
    message,
    code = 403,
    validations = undefined
) => {
    const err = new Error(message)
    // @ts-ignore
    err.code = code
    // @ts-ignore
    err.validations = validations
    return err
}

export const tokenize = async (data: Partial<IUser>) => {
    const token = encryptData(JSON.stringify(data))
    return token
}

export const success = (msg: string, data: any, meta?: object) => ({
    data,
    status: true,
    message: msg,
    ...(meta && { meta }),
})

export const Authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const tokenKey = req.get("Authorization")
    try {
        if (!tokenKey) throw catchError("No Authorization header provided", 401)
        const token = tokenKey?.split(" ")[1]
        if (!token) throw catchError("No Authorization header provided", 401)

        let user = decrytData(token)
        const parsedUser = JSON.parse(user) as { _id: string; exp: Date };
        const [newUser, error] = await tryPromise(
            new UserService({ _id: parsedUser._id }).findOne(),
        )

        if (error) throw catchError("Unathorized", 401);
        if (!newUser) throw catchError("Unathorized", 401);

        if (isAfter(new Date(), new Date(parsedUser.exp))) {
            throw catchError("Session expired. Please login again")
        }

        req.user = newUser

        return next()
    } catch (error) {
        next(error)
    }
}

export const AuthenticateSync = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const tokenKey = req.get("Authorization")
    try {
        if (!tokenKey) throw catchError("No Authorization header provided", 401)
        const token = tokenKey?.split(" ")[1]
        if (!token) throw catchError("No Authorization header provided", 401)

        let user = decrytData(token)
        const newUser = JSON.parse(user) as Token

        if (isAfter(new Date(), new Date(newUser.time))) {
            throw catchError("Session expired!")
        }

        req.user = newUser

        return next()
    } catch (error) {
        next(error)
    }
}

export const errorHandler = (
    error: AppError,
    req: any,
    res: Response,
    _next: any
) => {
    try {
        let code = error.code || 500
        let msg = error.message

        if (error.name === "MongoServerError") {
            if (error.code === 11000) {
                if (
                    error.message.includes("users") &&
                    error.message.includes("email_1_phoneNumber_1 dup key")
                ) {
                    code = 422
                    msg = "Your account already exists. Kindly login"
                } else {
                    msg = "Duplicate Error"
                    code = 422
                }
            }
        }

        console.log(error.name || "Error", error.message)
        return res.status(code).json({ status: false, message: msg })
    } catch (e) {
        return res.status(500).json({ status: false })
    }
}

export const validate = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        const message = errors.array({ onlyFirstError: true })
        console.log(message, req.url)

        throw catchError(message[0].msg, 400)
    } catch (e) {
        return next(e)
    }
}

export class validator {
    static body(schema: Schema) {
        return (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body)
                return next()
            } catch (error: any) {
                let message
                const issues = error.issues[0]
                if (issues.code === "unrecognized_keys") {
                    message = `The following keys are not allowed ${issues.keys.join(
                        ", "
                    )}`
                } else {
                    message = issues.message
                }
                throw catchError(message, 402)
            }
        }
    }

    static query(schema: Schema) {
        return (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.query)
                return next()
            } catch (error: any) {
                let message
                const issues = error.issues[0]
                if (issues.code === "unrecognized_keys") {
                    message = `The following keys are not allowed ${issues.keys.join(
                        ", "
                    )}`
                } else {
                    message = issues.message
                }
                throw catchError(message, 402)
            }
        }
    }

    static params(schema: Schema) {
        return (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.params)
                return next()
            } catch (error: any) {
                let message
                const issues = error.issues[0]
                if (issues.code === "unrecognized_keys") {
                    message = `The following keys are not allowed ${issues.keys.join(
                        ", "
                    )}`
                } else {
                    message = issues.message
                }
                throw catchError(message, 402)
            }
        }
    }
}

export function generateRandomDigit(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const createReference = () => {
    const date = new Date().getTime()
    const ns = format(new Date(), "yyyyMMddhhssmm")
    const ref = `ONE-${date}-${ns}`;

    return ref
}

export const tryPromise = async <T>(
    data: Promise<T>
): Promise<[T | null, null | string]> => {
    try {
        const result = await data
        return [result, null]
    } catch (error: any) {
        console.log({ error, params: data });
        return [null, error.message]
    }
}

export const escapeSpecialCharacters = (text: string) => {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").trim()
}

export const createExactMatchRegex = (str: string) =>
    new RegExp(`^${escapeSpecialCharacters(str)}`, "i")

