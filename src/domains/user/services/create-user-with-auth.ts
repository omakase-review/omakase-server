import { AuthType, PrismaClient } from "@prisma/client";

export const createUserWithAuth = ({ email,socialId,type }: { email: string;socialId:string, type: AuthType }, prisma: PrismaClient) => {
    return prisma.user.create({
        data: {
            email,
            auth: {
                create: [{
                    socialId,
                    type
                }]
            }
        }
    });
};
