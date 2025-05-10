/** @format */

import { Router } from "express"

import { get } from "./controller"

const walletRouter = Router({
    caseSensitive: true,
    strict: true,
})

walletRouter.get("/", get)

export default walletRouter
