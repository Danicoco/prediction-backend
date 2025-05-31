/** @format */

import { Router } from "express"

import { fetch, get, verifyAccount } from "./controller"

const bankRouter = Router({
    caseSensitive: true,
    strict: true,
})

bankRouter.get("/", fetch);
bankRouter.get("/account", get);
bankRouter.post("/verify-account", verifyAccount);

export default bankRouter
