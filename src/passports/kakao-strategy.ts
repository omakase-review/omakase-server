/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { AuthType, SocialType } from "@prisma/client";
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createUserWithAuth } from "../domains/user/services/create-user-with-auth";
import { getUserByAuth } from "../domains/user/services/get-user-by-auth";
// import { BadReqError } from "../lib/http-error";

export default () => {
    passport.use(
        new KakaoStrategy({ ...conf().KAKAO_CONFIG }, async (accessToken, _refreshToken, profile, cb) => {
            const { has_email, email, name: _name, id } = profile._json.kakao_account;
            if (!has_email || !email) {
                return cb(new Error("Not Found Email"));
                // return cb(new BadReqError("Not Found Email"));
            }

            const type = SocialType.Kakao;

            const user = await getUserByAuth({ email, type, socialId: id }, prisma);

            if (!user) {
                const createdUser = await createUserWithAuth({ email, type, socialId: id }, prisma);

                return cb(null, { ...createdUser, accessToken });
            }
            return cb(null, { ...user, accessToken });
        })
    );
};
