import { SocialType, PrismaClient } from "@prisma/client";

export const createUserWithAuth = ({ email,socialId,type }: { email: string;socialId:string, type: SocialType }, prisma: PrismaClient) => {
    return prisma.user.create({
        data: {
            email,
            socials: {
                create: [{
                    socialId,
                    type
                }]
            }
        }
    });
};
