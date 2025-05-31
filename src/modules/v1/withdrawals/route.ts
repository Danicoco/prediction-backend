/** @format */

import { Router } from "express"

import { create } from "./controller"
import { validator } from "../../common/utils"
import { createSchema } from "./validation"

const withdrawalRouter = Router({
    caseSensitive: true,
    strict: true,
})

withdrawalRouter.post("/", validator.body(createSchema), create)

export default withdrawalRouter
