import { RevisitStatus, ServiceStatus, TasteStatus } from "@prisma/client";
import type { Request, Response } from "express";
import TSON from "typescript-json";
import { conf } from "../../../config";
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

    if (!req.id) {
        throw new Error("No User");
    }
    // const userId = req.id;

    const { success, errors: _errors } = TSON.validate<ReqBody>({ ...req.body });

    if (!success) {
        throw new Error(TSON.stringify(_errors));
    }

    const files = (req.files as {[fieldName: string]: Express.Multer.File[]}).images.map(f => `${conf().CLIENT_DOMAIN}/${f.filename}`);

    if(!files || files.length < 1){
        throw new Error("Should be at least 1 image");
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
            userId: req.id,
            restaurantId: Number(req.params.id),
            images: {
                create: files.map( url => ({url}))
            }

        }
    });
    res.status(200).json({ data: reviews });
};
