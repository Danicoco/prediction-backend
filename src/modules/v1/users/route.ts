/** @format */

import { Router } from "express"

import { changePasswordSchema, createSchema, fetchSchema, loginSchema, resendCodeSchema, resetPasswordSchema, updateSchema, verifySchema } from "./validation"
import { update, create, fetch, login, profile, remove } from "./controller"
import { Authenticate, validator } from "../../common/utils"
import { validateChangePassword, validateCreate, validateForgetPassword, validateResendCode, validateResetPassword, verifyAccount } from "./middleware"

const userRouter = Router({
    caseSensitive: true,
    strict: true,
})

userRouter.post(
    "/",
    validator.body(createSchema),
    validateCreate,
    create
)

userRouter.post(
    "/verify-account",
    validator.body(verifySchema),
    verifyAccount,
    update
)

userRouter.patch(
    "/change-password",
    validator.body(changePasswordSchema),
    Authenticate,
    validateChangePassword,
    update
)

userRouter.post(
    "/resend-code",
    validator.body(resendCodeSchema),
    validateResendCode,
    update
)

userRouter.post(
    "/forget-password",
    validator.body(resendCodeSchema),
    validateForgetPassword,
    update
)

userRouter.post(
    "/reset-password",
    validator.body(resetPasswordSchema),
    validateResetPassword,
    update
)

userRouter.post(
    "/login",
    validator.body(loginSchema),
    login
)

userRouter.put(
    "/profile",
    Authenticate,
    validator.body(updateSchema),
    update
)

userRouter.get(
    "/profile",
    Authenticate,
    profile
)

userRouter.delete(
    "/profile",
    Authenticate,
    remove
)

userRouter.get("/", validator.body(fetchSchema), fetch)

export default userRouter
