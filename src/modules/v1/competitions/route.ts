/** @format */

import { Router } from "express"

import { fetch } from "./controller"

const competitionRouter = Router({
    caseSensitive: true,
    strict: true,
})

competitionRouter.get("/", fetch)

export default competitionRouter
