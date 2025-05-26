import { Router } from "express";

import userRouter from "./users/route";
import { Authenticate } from "../common/utils";
import pinRouter from "./pins/route";
import walletRouter from "./wallets/route";
import poolMemberRouter from "./pool-members/route";
import transactionRouter from "./transactions/route";
import competitionRouter from "./competitions/route";
import matchRouter from "./matches/route";
import predictionRouter from "./predictions/route";
import poolRouter from "./pools/route";

const router = Router();
router.use("/users", userRouter);
router.use("/pins", Authenticate, pinRouter);
router.use("/pools", Authenticate, poolRouter);
router.use("/matches", Authenticate, matchRouter);
router.use("/wallets", Authenticate, walletRouter);
router.use("/predictions", Authenticate, predictionRouter);
router.use("/pool-members", Authenticate, poolMemberRouter);
router.use("/competitions", Authenticate, competitionRouter);
router.use("/transactions", Authenticate, transactionRouter);


export default router;
