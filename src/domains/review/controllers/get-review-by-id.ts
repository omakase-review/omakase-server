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
            comments: {
                where: {
                    parentId: null
                },
                select: {
                    id: true,
                    text: true,
                    user: true,
                    childs: {
                        select: {
                            id: true,
                            text: true,
                            user: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    favorites: true
                }
            },
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
            },
            user: {
                select: {
                    name: true
                }
            }
        }
    });

    res.status(200).json({ data: review });
};
