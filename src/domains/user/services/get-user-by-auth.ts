import { SocialType, PrismaClient } from "@prisma/client";

export const getUserByAuth = ({ email,socialId ,type}: { email: string,socialId: string ,type: SocialType}, prisma: PrismaClient) => {
    return prisma.user.findUnique({
        where: {
            email
        },
        include: {
            socials: {
                where: {
                    socialId,
                    type
                },
                take: 1
            }
        }
    });
};
