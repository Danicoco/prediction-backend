/** @format */

import { Router } from "express"

import { createSchema, fetchSchema } from "./validation"
import { create, fetch, } from "./controller"
import { validator } from "../../common/utils"
import { validateCreate } from "./middleware"

const poolMemberRouter = Router({
    caseSensitive: true,
    strict: true,
})

poolMemberRouter.post(
    "/",
    validator.body(createSchema),
    validateCreate,
    create
)

poolMemberRouter.get(
    "/",
    validator.query(fetchSchema),
    fetch
)

export default poolMemberRouter
