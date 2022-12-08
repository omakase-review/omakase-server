/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createUser } from "../domains/user/services/create-user";
import { getUserByEmail } from "../domains/user/services/get-user-by-email";
// import { BadReqError } from "../lib/http-error";

export default () => {
    passport.use(
        new KakaoStrategy({ ...conf().KAKAO_CONFIG }, async (accessToken, _refreshToken, profile, cb) => {
            const { has_email, email, name: _name } = profile._json.kakao_account;
            if (!has_email || !email) {
                return cb(new Error("Not Found Email"));
                // return cb(new BadReqError("Not Found Email"));
            }

            const user = await getUserByEmail({ email }, prisma);

            if (!user) {
                const createdUser = await createUser({ email }, prisma);

                return cb(null, { ...createdUser, accessToken });
            }
            return cb(null, { ...user, accessToken });
        })
    );
};
