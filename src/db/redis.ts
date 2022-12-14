import * as redis from "redis";
import { conf } from "../config";
// import { BadReqError } from "../lib/http-error";

const client = redis.createClient({ url: conf().REDIS_URL });
client.on("error", (err: unknown) => console.log("Redis Client Error", err));
(async () => {
    await client.connect();
})();

export const getRedis = () => {
    if (!client) {
        throw new Error("No Connection Redis");
        // throw new BadReqError("No Connection Redis");
    }
    return client;
};
