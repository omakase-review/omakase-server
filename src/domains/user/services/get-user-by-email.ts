import { PrismaClient } from "@prisma/client";

export const getUserByEmail = ({ email }: { email: string }, prisma: PrismaClient) => {
    return prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            socials: true,
            auth: true,
        },
        where: {
            email
        }
    });
};
