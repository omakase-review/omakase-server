import { PrismaClient } from "@prisma/client";

export const getUserByEmail = ({ email }: { email: string }, prisma: PrismaClient) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
};
