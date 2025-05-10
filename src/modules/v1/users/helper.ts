import { Request } from "express";

export const composeFilter = (req: Request) => {
    const { firstName, lastName, email, phoneNumber, isActive } = req.query;
    let filter = {}

    if (firstName) filter = { ...filter, firstName };
    if (lastName) filter = { ...filter, lastName };
    if (email) filter = { ...filter, email };
    if (phoneNumber) filter = { ...filter, phoneNumber };
    if (isActive !== undefined) filter = { ...filter, resolved: JSON.parse(isActive as string) }

    return filter;
}