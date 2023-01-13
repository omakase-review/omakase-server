import path from "path";

export const conf = () => {
    const PORT = process.env.PORT || 3000;
    const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
    const JWT_SECRET = process.env.JWT_SECRET || "thisisjwtsecret";
    const CLIENT_DOMAIN = "http://localhost:3000";

    const KAKAO_CONFIG = {
        clientID: process.env.KAKAO_CLIENT_ID || "",
        clientSecret: "",
        callbackURL: process.env.KAKAO_CALLBACK_URL || "http://localhost:3000/api/v1/auth/kakao/callback"
    };

    const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 14; // 14일

    const SESSION_OPTION = {
        secret: process.env.SESSION_SECRET || "sesecret",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: COOKIE_MAX_AGE,
            secure: false,
            httpOnly: true
        }
    };

    const IMAGES_DIR_PATH = path.join(process.cwd(), "images");
    const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 600 * 1000; // 600kb
    const MAX_FILES = Number(process.env.MAX_FILES) || 10;

    return {
        PORT,
        REDIS_URL,
        JWT_SECRET,
        CLIENT_DOMAIN,
        KAKAO_CONFIG,
        SESSION_OPTION,
        IMAGES_DIR_PATH,
        MAX_FILES,
        MAX_FILE_SIZE
    };
};
