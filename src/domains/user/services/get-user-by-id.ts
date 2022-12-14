import { PrismaClient } from "@prisma/client";

export const getUserById = ({ id }: { id: number }, prisma: PrismaClient) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    });
};
