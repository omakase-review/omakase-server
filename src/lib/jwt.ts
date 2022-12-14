import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { conf } from "../config";
import { getRedis } from "../db/redis";
// import { NotFoundError } from "./http-error";

export { jwt };

const JWT_ALGORITHM = "HS256";

// 액세스, 리프레스 토큰, Default 1시간, 14일
const ACCESS_TOKEN_EXPIRES = `${process.env.ACCESS_TOKEN_EXPIRES || "1"}h`;
const REFRESH_TOKEN_EXPIRES = `${process.env.REFRESH_TOKEN_EXPIRES || "14"}d`;

export type JwtPayload = { id: number };

export const sign = (user: User) => {
    const payload: JwtPayload = { id: user.id };

    return jwt.sign(payload, conf().JWT_SECRET, {
        algorithm: JWT_ALGORITHM,
        expiresIn: ACCESS_TOKEN_EXPIRES
    });
};

export const verify = (token: string) => {
    try {
        const decoded = jwt.verify(token, conf().JWT_SECRET) as JwtPayload;

        return { ok: true, id: decoded.id };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message
        };
    }
};

export const refresh = () => {
    return jwt.sign({}, conf().JWT_SECRET, {
        algorithm: JWT_ALGORITHM,
        expiresIn: REFRESH_TOKEN_EXPIRES
    });
};

export const verifyRefresh = async (token: string, userId: string) => {
    try {
        const data = await getRedis().get(userId);
        if (!data) {
            throw new Error("No refresh token");
            // throw new NotFoundError("No refresh token");
        }

        if (token !== data) {
            return {
                ok: false,
                message: "In valid refresh token"
            };
        }
        jwt.verify(token, conf().JWT_SECRET);

        // return true
        return {
            ok: true
        };
    } catch (error: any) {
        // return false
        return {
            ok: false,
            message: error.message
        };
    }
};
