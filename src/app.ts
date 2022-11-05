import express from "express";
import { errorMiddleware } from "./middleware/error";
import { requestLoggerMiddleware } from "./middleware/log";

export const startApp = () => {
    const app = express();

    app.use(requestLoggerMiddleware);

    app.get("/ping", (req, res) => {
        res.send("pong");
    });

    app.use("*", (req, res) => {
        res.status(404).json({ msg: "404" });
    });

    app.use(errorMiddleware);

    return app;
};
