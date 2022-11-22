import { RevisitStatus, ServiceStatus, TasteStatus } from "@prisma/client";
import type { Request, Response } from "express";
import TSON from "typescript-json";
import Prisma from "../../../db/prisma";

type ReqBody = {
    title: string;
    description: string;
    score: number;
    serviceStatus: ServiceStatus;
    tasteStatus: TasteStatus;
    revisitStatus: RevisitStatus;
};

export const createReview = async (req: Request<{ id?: string }, unknown, ReqBody>, res: Response) => {
    const id = req.params.id;
    if (!id) {
        throw new Error("No Restaurant Id");
    }

    // @TODO 로그인 회원가입 구현할 때 수정.
    // const userId = req.user.id;
    const userId = 1;

    const { success, errors: _errors } = TSON.validate<ReqBody>({ ...req.body });

    if (!success) {
        throw new Error(TSON.stringify(_errors));
    }

    const { title, score, description, serviceStatus, tasteStatus, revisitStatus } = req.body;

    const reviews = await Prisma.review.create({
        data: {
            title,
            score,
            description,
            serviceStatus,
            tasteStatus,
            revisitStatus,
            userId,
            restaurantId: Number(req.params.id)
        }
    });
    res.status(200).json({ data: reviews });
};
