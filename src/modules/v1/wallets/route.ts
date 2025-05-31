/** @format */

import { Router } from "express"

import { get, verifyTransaction } from "./controller"

const walletRouter = Router({
    caseSensitive: true,
    strict: true,
})

walletRouter.get("/", get)
walletRouter.post("/verify-payment", verifyTransaction)

export default walletRouter
