import { SocialType, PrismaClient } from "@prisma/client";

export const createSocial = ({ userId, social}: { userId: number, social: { socialId: string ,type: SocialType }}, prisma: PrismaClient) => {
    return prisma.social.create({
        data: {
            userId,
            socialId: social.socialId,
            type: social.type
        }
    })
};
