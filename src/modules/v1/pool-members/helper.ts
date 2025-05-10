import { Request } from "express";

export const composeFilter = (req: Request) => {
    const { user, poolId } = req.query;
    let filter = { pool: poolId } as any

    if (user) filter = { ...filter, user: String(user) };

    return filter;
}