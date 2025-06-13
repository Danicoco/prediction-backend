/** @format */

import { Router } from "express"

import { create, fetch } from "./controller"

const userCompetitionRouter = Router({
    caseSensitive: true,
    strict: true,
})

userCompetitionRouter.post("/", create)
userCompetitionRouter.get("/", fetch)

export default userCompetitionRouter
