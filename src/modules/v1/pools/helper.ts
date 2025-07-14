/** @format */

import { Request } from "express"
import { randomBytes, createHash } from "crypto"
import PoolService from "./service"
import { addYears } from "date-fns"

export const composeFilter = (req: Request) => {
    const { name, createdBy, privacy } = req.query
    let filter = {}

    if (name) filter = { ...filter, name }
    if (createdBy) filter = { ...filter, createdBy }
    if (privacy) filter = { ...filter, privacy }

    return filter
}

export function generateInviteCode(length = 8) {
    const timestamp = Date.now().toString(36) // base36 timestamp
    const randomStr = randomBytes(4).toString("hex") // 8 random chars
    const hash = createHash("sha256")
        .update(timestamp + randomStr)
        .digest("hex")

    return hash.substring(0, length).toUpperCase() // e.g., "9A1C2B3F"
}

export const getGeneralPool = async () => {
    const globalName = "Global"
    let pool = await new PoolService({ name: globalName }).findOne()
    if (!pool) {
        pool = await new PoolService({}).create({
            name: globalName,
            description: "General Pool for all Users",
            privacy: "public",
            config: {
                amount: 0,
                paid: false,
                poolSharing: "top-three",
                endDate: addYears(new Date(), 10),
                code: "Global",
            },
            totalMembers: 1,
            competition: "",
            isActive: true,
            createdBy: "682e96d88ee712d1782d4071",
        })
    }

    return pool
}
