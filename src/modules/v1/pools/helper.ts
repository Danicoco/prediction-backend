import { Request } from "express";
import { randomBytes, createHash } from "crypto";

export const composeFilter = (req: Request) => {
    const { name, createdBy, privacy } = req.query;
    let filter = {}

    if (name) filter = { ...filter, name };
    if (createdBy) filter = { ...filter, createdBy };
    if (privacy) filter = { ...filter, privacy };

    return filter;
}

export function generateInviteCode(length = 8) {
    const timestamp = Date.now().toString(36); // base36 timestamp
    const randomStr = randomBytes(4).toString('hex'); // 8 random chars
    const hash = createHash('sha256').update(timestamp + randomStr).digest('hex');
  
    return hash.substring(0, length).toUpperCase(); // e.g., "9A1C2B3F"
  }