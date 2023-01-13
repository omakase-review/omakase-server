import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { Prisma as _Prisma } from "@prisma/client"


// Check this https://github.com/GoogleChromeLabs/jsbi/issues/30
// https://github.com/expressjs/express/blob/master/lib/response.js#L271
// BigInt.prototype.toJSON = function() { return this.toString() }
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

const DEFAULT_TAKE = 5;

export const getRestaurantsByReviewCounts = async (req: Request<unknown, unknown, unknown, {take?: string, cursor?: string}>, res: Response) => {
    const take = Number(req.query.take) || DEFAULT_TAKE;
    const cursor = Number(req.query.cursor) || null

    const _cursorSql = _Prisma.sql`CONCAT(LPAD(review_count, 10, '0'), FLOOR(UNIX_TIMESTAMP(created_at)))`
    // 리뷰 개수 순 페이지네이션
    const restaurants = await Prisma.$queryRaw<{id: number, name: string, image: string, created_at: Date, review_count: number, total_score: number, _cursor: number}[]>`
        SELECT 
            id, 
            name,
            image,
            created_at, 
            review_count,
            total_score,
            ${_cursorSql} _cursor 
        FROM 
            restaurants
        ${
            // cursor 쿼리가 없으면 review_count 최대에서 부터 take 만큼
            cursor 
                ? _Prisma.sql`WHERE ${_cursorSql} < ${cursor}` 
                : _Prisma.empty
        }
        ORDER BY 
            review_count DESC, 
            created_at DESC 
        LIMIT ${take};
    `

    res.status(200).json({ data: restaurants, _cursor: restaurants.at(-1)?._cursor });
};
