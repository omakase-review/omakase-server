import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";

const TAKE = 10;

// @TODO pagenation을 구현해야하나?
export const getRecentReviews = async (req: Request, res: Response) => {
    const reviews = await Prisma.review.findMany({
        select: { id: true, title: true, user: { select: { name: true } }, restaurant: { select: { name: true } } },
        take: TAKE,
        orderBy: { createdAt: "desc" }
    });

    res.json({ data: reviews });
};
