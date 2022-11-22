import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";

type RawRestaurant = {
    id: number;
    name: string;
    image: string;
    score: number;
};

export const getHighScoreRestaurant = async (req: Request, res: Response) => {
    const LIMIT = 10;

    const restaurants = await Prisma.$queryRaw<RawRestaurant[]>`
        select 
            r.id, r.name, r.image, b.score 
        from restaurants r 
        join 
            (
                select 
                    r.restaurantId, AVG(r.score) score  
                from reviews r 
                group by restaurantId 
                order by score DESC 
                limit ${LIMIT}
            ) b 
        ON b.restaurantId = r.id
    `;
    res.status(200).json({ data: restaurants });
};
