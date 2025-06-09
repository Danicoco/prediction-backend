/** @format */

import { Router } from "express"

import { create, leaderboard } from "./controller"
import { validator } from "../../common/utils"
import { createSchema } from "./validation"

const predictionRouter = Router({
    caseSensitive: true,
    strict: true,
})

predictionRouter.post("/", validator.body(createSchema), create)

predictionRouter.get("/", leaderboard);

export default predictionRouter
