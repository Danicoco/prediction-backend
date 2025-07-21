/** @format */

import { Router } from "express"

import { fetch, fetchScore } from "./controller"

const matchRouter = Router({
    caseSensitive: true,
    strict: true,
})

matchRouter.get("/", fetch)
matchRouter.get("/score", fetchScore)

export default matchRouter
