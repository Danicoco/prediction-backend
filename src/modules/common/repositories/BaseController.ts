import { NextFunction, Request, Response } from "express";

class BaseController {
    constructor() {

    }

    public async base(fn: () => Promise<void>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
               await fn(); 
            } catch (error) {
                next(error);
            }
        }
    }
}

export default BaseController