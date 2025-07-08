/** @format */

import { Router } from "express"

import { addFilters, fetch, getNews, makeDefault } from "./controller"

const competitionRouter = Router({
    caseSensitive: true,
    strict: true,
})

competitionRouter.get("/", fetch)
competitionRouter.get("/news", getNews)
competitionRouter.patch("/:id", addFilters)
competitionRouter.post("/:code", makeDefault)

export default competitionRouter
