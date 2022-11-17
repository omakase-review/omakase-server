import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";

export const getCheapLunchRestaurant = async (req: Request, res: Response) => {
    const restaurants = await Prisma.restaurant.findMany({
        select: {
            image: true,
            lunchPrice: true,
            name: true,
            reviews: {
                select: {
                    scope: true
                }
            }
        },
        where: {
            NOT: {
                lunchPrice: null
            }
        },
        take: 10,
        orderBy: {
            lunchPrice: "asc"
        }
    });
    res.status(200).json({ data: restaurants });
};
