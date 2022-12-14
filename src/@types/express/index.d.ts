/* eslint-disable @typescript-eslint/no-empty-interface */
import { User as Users } from "@prisma/client";

export {};

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface AuthInfo {}
        export interface Request {
            id: number;
        }
        export interface User extends Users {
            accessToken?: string;
        }
    }
}
