/** @format */

import { Router } from "express"

import { fetch, makeDefault } from "./controller"

const competitionRouter = Router({
    caseSensitive: true,
    strict: true,
})

competitionRouter.get("/", fetch)
competitionRouter.post("/:code", makeDefault)

export default competitionRouter
