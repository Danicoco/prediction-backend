/** @format */

import { Router } from "express"

import { create } from "./controller"

const pinRouter = Router({
    caseSensitive: true,
    strict: true,
})

pinRouter.post("/", create)

export default pinRouter
