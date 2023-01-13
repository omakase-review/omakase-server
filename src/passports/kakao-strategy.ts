/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { AuthType, SocialType } from "@prisma/client";
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createSocial } from "../domains/user/services/create-social";
import { createUserWithAuth } from "../domains/user/services/create-user-with-auth";
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

            const socialId = profile._json.id.toString() as string;
            if(!socialId) {
                return cb(new Error("Not found social id"));
            }

            const user = await getUserByEmail({ email }, prisma);

            if(!user){
                const createdUser = await createUserWithAuth({ email, social: { type: SocialType.Kakao, socialId }, auth: { authType: AuthType.User } }, prisma);

                return cb(null, { ...createdUser, accessToken });
            }

            if(!user.socials || user.socials.length < 1 ){
                // 기존 유저에서 소셜만 추가.
                const social = await createSocial({ userId: user.id, social: { socialId, type: SocialType.Kakao }}, prisma)
                
                const _user = { ...user, socials: [...user.socials, social] };
                return cb(null, { user: _user, accessToken })
            }

            const mMap = new Map<SocialType, string>();

            for(const social of user.socials){
                mMap.set(social.type, social.socialId)
            }

            const uSocialId = mMap.get(SocialType.Kakao)
            if(!uSocialId || uSocialId !== socialId){
                // 유저 있는데 카카오 소셜이 없는 경우. 
                // 예) 애플 소셜은 있는데 카카오 소셜이 없는 경우
                // 카카오 소셜 추가.
                const social = await createSocial({ userId: user.id, social: { socialId, type: SocialType.Kakao }}, prisma)
                const _user = { ...user, socials: [...user.socials, social] };
                return cb(null, { user: _user, accessToken })
            }

            return cb(null, { ...user, accessToken });
        })
    );
};
