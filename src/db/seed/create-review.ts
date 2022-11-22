import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    const user = await prisma.user.create({ data: { name: "user1", email: "testggg@gmail.com" } });

    const restaurant = await prisma.restaurant.create({ data: { name: "r-1" } });

    await prisma.review.create({
        data: {
            title: "리뷰입니다.",
            score: 0.5,
            description: "리뷰 설명입니다.",
            serviceStatus: "NOMAL",
            tasteStatus: "NOMAL",
            revisitStatus: "SOSO",
            userId: user.id,
            restaurantId: restaurant.id
        }
    });

    const rv = await prisma.review.findMany({
        select: { user: { select: { name: true } }, restaurant: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    console.log("rv :", rv);
};

if (require.main === module) {
    main()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        });
}
