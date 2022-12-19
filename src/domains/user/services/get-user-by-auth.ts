import { AuthType, PrismaClient } from "@prisma/client";

export const getUserByAuth = ({ email,socialId ,type}: { email: string,socialId: string ,type: AuthType}, prisma: PrismaClient) => {
    return prisma.user.findUnique({
        where: {
            email
        },
        include: {
            auth: {
                where: {
                    socialId,
                    type
                },
                take: 1
            }
        }
    });
};
