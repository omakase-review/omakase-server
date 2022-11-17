import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { Request, Response, NextFunction } from "express";

export const dbErrorMiddleware = (err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof PrismaClientKnownRequestError) {
        res.status(400).json({ msg: err.message });
    } else {
        next();
    }
};

export const errorMiddleware = (_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ msg: "error test" });
};
