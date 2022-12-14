import { Request, Response } from "express";
import Prisma from "../../../db/prisma";

export const createFavorite = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
        throw new Error("No Review Id");
    }
    if (!req.id) {
        throw new Error("No User");
    }

    const favorite = await Prisma.favorites.create({
        data: {
            userId: req.id,
            reviewId: Number(id)
        }
    });

    res.status(200).json({ data: favorite });
};
