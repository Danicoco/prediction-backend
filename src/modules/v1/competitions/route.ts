/** @format */

import { Router } from "express"

import { addFilters, fetch, makeDefault } from "./controller"

const competitionRouter = Router({
    caseSensitive: true,
    strict: true,
})

competitionRouter.get("/", fetch)
competitionRouter.post("/:code", makeDefault)
competitionRouter.patch("/:id", addFilters)

export default competitionRouter
