import { SocialType, PrismaClient, AuthType } from "@prisma/client";

export const createUserWithAuth = ({ email, social: {socialId, type}, auth: { authType } }: { email: string; social: { socialId: string, type: SocialType}, auth: { authType: AuthType } }, prisma: PrismaClient) => {
    return prisma.user.create({
        select: {
            id: true,
            email: true,
            socials: true,
            auth: true,
        },
        data: {
            email,
            socials: {
                create: [{
                    socialId,
                    type
                }]
            },
            auth: {
                create: {
                    type: authType
                }
            }
        }
    });
};
