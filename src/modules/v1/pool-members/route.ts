/** @format */

import { Router } from "express"

import { createSchema, fetchSchema, updateSchema } from "./validation"
import { create, fetch, update } from "./controller"
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

poolMemberRouter.patch(
    "/:_id",
    validator.body(updateSchema),
    update
)

poolMemberRouter.get(
    "/",
    validator.query(fetchSchema),
    fetch
)

export default poolMemberRouter
