import { Request } from "express";

export const composeFilter = (req: Request) => {
    const { user, poolId, status } = req.query;
    let filter = { pool: poolId } as any

    if (user) filter = { ...filter, user: String(user) };
    if (status) filter = { ...filter, status }

    return filter;
}