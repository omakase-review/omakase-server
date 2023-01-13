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

    const _id = Number(id);

    const r = await Prisma.restaurant.findUnique({
        select: {
            totalScore: true,
            reviewCount: true,
        },
        where: {
            id: _id
        }
    });

    if(!r){
        throw new Error("Not found Restaurant");
    }

    const { totalScore, reviewCount } = r;

    // 소수점 2 자리까지
    const numerator = Number(totalScore) * reviewCount + score;
    const denominator = r!.reviewCount + 1;

    const _totalScore = Math.floor(numerator / denominator * 100) / 100;

    const reviews = await Prisma.$transaction(async (tx) => {
        await tx.restaurant.update({
            where: {
                id: _id
            },
            data: {
                reviewCount: {
                    increment: 1
                },
                totalScore: _totalScore
            }
        });
    
        const reviews = await tx.review.create({
            data: {
                title,
                score,
                description,
                serviceStatus,
                tasteStatus,
                revisitStatus,
                userId: req.id,
                restaurantId: _id,
                images: {
                    create: files.map( url => ({url}))
                }
    
            }
        });

        return reviews
    }, {
        maxWait: 5000,
        timeout: 10000,
    });

    res.status(200).json({ data: reviews });
};
