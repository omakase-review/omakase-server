import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10000; i++) {
        await prisma.review.create({
            data: { userId: 3, restaurantId: 1, score: 3.5 }
        });
        await prisma.review.create({
            data: { userId: 3, restaurantId: 4, score: 5 }
        });
    }

    // 1.
    // const rv = await prisma.review.groupBy({
    //     by: ["restaurantId"],
    //     _avg: {
    //         score: true
    //     },
    //     orderBy: {
    //         _avg: { score: "desc" }
    //     },
    //     take: 3
    // });
    // console.log("rv :", rv);
    // const arr = rv.map((r) => r.restaurantId);
    // console.log(arr);
    // const rests = await prisma.restaurant.findMany({
    //     where: {
    //         id: { in: arr }
    //     },
    //     select: { id: true, image: true }
    // });
    // console.log(rests);

    // 2 로우쿼리
    const rv = await prisma.$queryRaw`
        select 
            r.id,r.name, r.image, b.score 
        from restaurants r 
        join 
            (
                select 
                    r.restaurantId, AVG(r.score) score  
                from reviews r 
                group by restaurantId 
                order by score DESC 
                limit 3
            ) b 
        ON b.restaurantId = r.id
    `;
    console.log(rv);
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
