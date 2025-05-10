import { Request } from "express";

export const composeFilter = (req: Request) => {
    const { name, createdBy, privacy } = req.query;
    let filter = {}

    if (name) filter = { ...filter, name };
    if (createdBy) filter = { ...filter, createdBy };
    if (privacy) filter = { ...filter, privacy };

    return filter;
}