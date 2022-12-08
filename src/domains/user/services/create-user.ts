import { PrismaClient } from "@prisma/client";

export const createUser = ({ email }: { email: string }, prisma: PrismaClient) => {
    return prisma.user.create({
        data: {
            email
        }
    });
};
