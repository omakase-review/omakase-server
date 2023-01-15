import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { Prisma as _Prisma } from "@prisma/client"


// Check this https://github.com/GoogleChromeLabs/jsbi/issues/30
// https://github.com/expressjs/express/blob/master/lib/response.js#L271
// BigInt.prototype.toJSON = function() { return this.toString() }
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

type RestaurantsReturnType = {
    id: number, 
    name: string, 
    image: string, 
    lunch_price: number, 
    dinner_price: number, 
    address: string, 
    parking: boolean,
    review_count: number, 
    total_score: number, 
    created_at: Date, 
    _cursor: number
}[];

const DEFAULT_TAKE = 5;

export const getRestaurantsByReviewCounts = async (req: Request<unknown, unknown, unknown, {take?: string, cursor?: string}>, res: Response) => {
    const take = Number(req.query.take) || DEFAULT_TAKE;
    if(take < 1){
        throw new Error("take must be at least 1");
    }
    const cursor = Number(req.query.cursor) || null

    const _cursorAlias = _Prisma.sql`CONCAT(LPAD(review_count, 10, '0'), FLOOR(UNIX_TIMESTAMP(created_at)))`;

    const _cursorSql = cursor 
        ? _Prisma.sql`WHERE ${_cursorAlias} < ${cursor}` 
        : _Prisma.empty
    // 리뷰 개수 순 페이지네이션
    const restaurants = await Prisma.$queryRaw<RestaurantsReturnType>`
        SELECT 
            id, 
            name,
            image,
            lunch_price,
            dinner_price,
            address.
            parking,
            review_count,
            total_score,
            created_at, 
            ${_cursorAlias} _cursor 
        FROM 
            restaurants
        ${_cursorSql}
        ORDER BY 
            review_count DESC, 
            created_at DESC 
        LIMIT ${take};
    `

    res.status(200).json({ data: restaurants, _cursor: restaurants.at(-1)?._cursor });
};
