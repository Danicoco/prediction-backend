/** @format */

import { Router } from "express"

import { fetch, fetchScore } from "./controller"
import { validator } from "../../common/utils"
import { fetchSchema } from "./validation"

const matchRouter = Router({
    caseSensitive: true,
    strict: true,
})

matchRouter.get("/", validator.query(fetchSchema), fetch)
matchRouter.get("/score", fetchScore)

export default matchRouter
