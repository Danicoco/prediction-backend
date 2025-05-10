import { Router } from "express";

import userRouter from "./users/route";
import poolRouter from "./pool-members/route";
import { Authenticate } from "../common/utils";
import pinRouter from "./pins/route";
import walletRouter from "./wallets/route";
import poolMemberRouter from "./pool-members/route";
import transactionRouter from "./transactions/route";

const router = Router();
router.use("/users", userRouter);
router.use("/pools", Authenticate, poolRouter);
router.use("/transactions", Authenticate, transactionRouter);
router.use("/pool-members", Authenticate, poolMemberRouter);
router.use("/wallets", Authenticate, walletRouter);
router.use("/pins", Authenticate, pinRouter);


export default router;
