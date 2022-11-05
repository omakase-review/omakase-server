import type { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/ban-types
export const controllerHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
