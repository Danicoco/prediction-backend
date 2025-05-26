/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import PinService from "./service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [pin, error] = await tryPromise(
            new PinService({ user: String(req.user._id) }).findOne()
        )

        if (error) throw catchError("Error processing request")
        if (pin) throw catchError("You already have a pin")

        const [_, crtError] = await tryPromise(
            new PinService({}).create({
                code: req.body.code,
                user: String(req.user._id),
                lastChangedAt: new Date(),
                attemptLeft: 3,
            })
        )

        if (crtError) throw catchError("Error processing request")

        return res.status(200).json(success("Pin created successfully", {}))
    } catch (error) {
        next(error)
    }
}
