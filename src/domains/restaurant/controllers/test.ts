import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { Prisma as _Prisma } from "@prisma/client"


// Check this https://github.com/GoogleChromeLabs/jsbi/issues/30
// https://github.com/expressjs/express/blob/master/lib/response.js#L271
// BigInt.prototype.toJSON = function() { return this.toString() }
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

type ReqQuery = {
    take?: string, 
    cursor?: string,
    lunch?: string, // ?lunch=1,10 // ?lunch=0,10
    dinner?: string,
    gu?: string,
    parking?: string
}

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

const DEFAULT_START_LUNCH_PRICE = 1; // 만원 단위
const DEFAULT_END_LUNCH_PRICE = 15;
const DEFAULT_START_DINNER_PRICE = 1;
const DEFAULT_END_DINNER_PRICE = 40;

// @Example
// ?query=강남,종로 => ["강남", "종로"] => "강남,종로"
// ?query=강남,종로, => ["강남", "종로", ""] => "강남,종로"
// ?query=, => ["", ""] => "," => ""
function queryParser(query: string){
    return query.split(",").reduce((pre, curr) => {
        if(!curr){
            return pre;
        }
        return [...pre, curr]
    }, [] as string[]);
}

function createGuQuery(guQuery?: string){
    if(!guQuery){
        return _Prisma.empty;
    }

    const _gu = queryParser(guQuery).join(",");
    return _gu.length > 0 ?  _Prisma.sql`(gu IN (${_gu})) AND` : _Prisma.empty;
}

export const getTestFilter = async (req: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const take = Number(req.query.take) || DEFAULT_TAKE;
    if(take < 1){
        throw new Error("take must be at least 1");
    }
    const cursor = Number(req.query.cursor) || null
    
    if(!req.query.lunch || !req.query.dinner){
        throw new Error("Not Found query strings")
    }

    // const lunchArray = queryParser(req.query.lunch);
    // const dinnerArray = queryParser(req.query.dinner);
    const lunchArray = req.query.lunch.split(",");
    const dinnerArray = req.query.dinner.split(",");
    if( lunchArray.length !== 2 || dinnerArray.length !== 2){
        throw new Error("query string must be array of two");
    }

    const startLunchPrice = lunchArray[0] || DEFAULT_START_LUNCH_PRICE;
    const endLunchPrice = lunchArray[1] || DEFAULT_END_LUNCH_PRICE;

    const startDinnerPrice = dinnerArray[0] || DEFAULT_START_DINNER_PRICE;
    const endDinnerPrice = dinnerArray[1] || DEFAULT_END_DINNER_PRICE;

    for(const price of [startLunchPrice, endLunchPrice, startDinnerPrice, endDinnerPrice]){
        if(!Number(price)){
            throw new Error("query string is Not a Number");
        }
    }

    const _cursorAlias = _Prisma.sql`CONCAT(LPAD(review_count, 10, '0'), FLOOR(UNIX_TIMESTAMP(created_at)))`;

    const _cursorSql = cursor 
        ? _Prisma.sql`(${_cursorAlias} < ${cursor}) AND` 
        : _Prisma.empty
    
    const guSql = createGuQuery(req.query.gu);

    const parkingSql = req.query.parking && req.query.parking.toLowerCase() === "true" 
        ? _Prisma.sql`AND (parking = true)` 
        : _Prisma.empty;

    
    // 리뷰 개수 순 페이지네이션
    const restaurants = await Prisma.$queryRaw<RestaurantsReturnType>`
        SELECT 
            id, 
            name,
            image,
            lunch_price,
            dinner_price,
            address
            parking,
            review_count,
            total_score, 
            created_at,
            ${_cursorAlias} _cursor 
        FROM 
            restaurants
        WHERE
            ${_cursorSql}
            ${guSql}
            (lunch_price BETWEEN ${startLunchPrice} AND ${endLunchPrice}) AND 
            (dinner_price BETWEEN ${startDinnerPrice} AND ${endDinnerPrice})
            ${parkingSql}
        ORDER BY 
            total_score DESC, 
            created_at DESC 
        LIMIT ${take};
    `

    res.status(200).json({ data: restaurants, _cursor: restaurants.at(-1)?._cursor });
};
