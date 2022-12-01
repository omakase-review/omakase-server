import { Request, Response } from "express";
import Prisma from "../../../db/prisma";

export const createFavorite = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
        throw new Error("No Review Id");
    }
    const favorite = await Prisma.favorites.create({
        data: {
            // @TODO 회원가입/로그인 구현되면 수정.
            userId: 1,
            reviewId: Number(id)
        }
    });

    res.status(200).json({ data: favorite });
};
