/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import UserService from "./service"
import { randomInt } from "crypto"
import { configs } from "../../common/utils/config"
import { addMinutes, isAfter } from "date-fns"
import { decrytData, encryptData } from "../../common/hashings"

export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { phoneNumber, email } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                $or: [{ phoneNumber }, { email }],
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user) throw catchError("Account already exist. Kindly login", 400)

        // validate promo

        return next()
    } catch (error) {
        next(error)
    }
}

export const verifyAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, otp } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user.verifiedAt)
            throw catchError("Your account has been verified. Proceed to login")
        if (configs.NODE_ENV === "production") {
            if (
                isAfter(
                    new Date(),
                    addMinutes(new Date(String(user.updatedAt)), 10)
                )
            )
                throw catchError(
                    "Verification code has expired. Resend to proceed"
                )
            if (user.otp !== otp)
                throw catchError("Verification Code is incorrect")
        }
        req.body = { otp: "", verifiedAt: new Date() }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateResendCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user.verifiedAt)
            throw catchError("Your account has been verified. Proceed to login")
        req.body = { otp: randomInt(1000, 9999) }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateForgetPassword = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const { email } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
                isActive: true
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        req.body = { otp: randomInt(1000, 9999) }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateResetPassword = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const { email, otp, password } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
                isActive: true
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
            if (configs.NODE_ENV === "production") {
                if (
                    isAfter(
                        new Date(),
                        addMinutes(new Date(String(user.updatedAt)), 10)
                    )
                )
                    throw catchError(
                        "Verification code has expired. Resend to proceed"
                    )
                if (user.otp !== otp)
                    throw catchError("Verification Code is incorrect")
            }
        req.body = { otp: "", password: encryptData(password) }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateChangePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { oldPassword, password } = req.body
    const user = req.user;
    try {
        console.log({ oldPassword, password });
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)

        const isMatch = decrytData(user.password) === oldPassword;
        if (!isMatch) throw catchError("Invalid password!", 400);

        
        req.body = { password: encryptData(password) }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}
