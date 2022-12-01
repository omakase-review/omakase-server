import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";

export const getReviewById = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
        throw new Error("No Review Id");
    }
    const review = await Prisma.review.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            id: true,
            title: true,
            description: true,
            score: true,
            serviceStatus: true,
            tasteStatus: true,
            revisitStatus: true,
            images: {
                select: {
                    id: true,
                    url: true
                }
            },
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    address: true
                }
            }
        }
    });

    res.status(200).json({ data: review });
};
