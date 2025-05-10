/** @format */

import { Router } from "express"

import { fetch } from "./controller"

const transactionRouter = Router({
    caseSensitive: true,
    strict: true,
})

transactionRouter.get(
    "/",
    fetch
)

export default transactionRouter
