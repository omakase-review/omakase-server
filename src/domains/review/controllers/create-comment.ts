import type { Request, Response } from "express";
import TSON from "typescript-json";
import Prisma from "../../../db/prisma";

type ReqParam = {
    id?: string;
};

type ReqBody = {
    text: string;
    parentId?: number;
};

export const createComment = async (req: Request<ReqParam, unknown, ReqBody>, res: Response) => {
    const id = req.params.id;
    if (!id) {
        throw new Error("No Comment Id");
    }

    const { success, errors } = TSON.validate<ReqBody>(req.body);

    if (!success) {
        throw new Error(TSON.stringify(errors));
    }

    const comment = await Prisma.comments.create({
        data: {
            userId: req.id,
            reviewId: Number(id),
            text: req.body.text,
            ...(req.body.parentId && { parentId: req.body.parentId })
        }
    });

    res.json(comment);
};
