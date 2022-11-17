import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";

export const getRecentRestaurants = async (req: Request, res: Response) => {
    const restaurants = await Prisma.restaurant.findMany({
        take: 10,
        orderBy: {
            createdAt: "desc"
        }
    });
    res.status(200).json({ data: restaurants });
};
