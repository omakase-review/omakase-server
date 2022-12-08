import { User } from "@prisma/client";
import passport from "passport";
// import { NotFoundError } from "../lib/http-error";
import kakao from "./kakao-strategy";

export default () => {
    passport.serializeUser((user: User, done) => {
        return done(null, user);
    });
    passport.deserializeUser(async (user: User, done) => {
        if (!user) {
            return done(new Error("No User"));
            // return done(new NotFoundError("No User"));
        }
        return done(null, user);
    });

    kakao();
};
