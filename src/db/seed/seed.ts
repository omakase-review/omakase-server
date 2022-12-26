import { PrismaClient } from "@prisma/client";
import path from "path";
import TSON from "typescript-json";
import { exist } from "../../lib/check-exist-file";
import { isURL } from "../../lib/check-url";
import { readXlsx } from "../../lib/read-xlsx";

// @TODO 각 string 자리가 숫자 두자리 수로 제한 되게, dot 2개 이후로 3번째 dot은 안받게
type CustomDate1 = number;
type CustomDate2 = `${string}.${string}`;
type CustomDate3 = `${string}.${string}.${string}`;

const GU_TYPE = [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구"
] as const;

type ExelType = {
    name?: string;
    lunchPrice?: number | "";
    dinnerPrice?: number | "";
    corkCharge?: string;
    phoneNumber?: string;
    dayOff?: string;
    parking?: string;
    address?: string;
    snss?: string;
    openedAt?: CustomDate1 | CustomDate2 | CustomDate3 | "";
};

type DataType = {
    name?: string;
    lunchPrice?: number;
    dinnerPrice?: number;
    corkCharge?: string;
    phoneNumber?: string;
    dayOff?: string;
    parking?: boolean;
    address?: string;
    snss?: string;
    openedAt?: Date;
    image?: string;
};

const prisma = new PrismaClient();
const FILE_PATH = path.join(process.cwd(), "src/db/seed.xlsx");
const DEFAULT_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPrTZ8Wd_zfPVG6dIFJSGa_1OdYqA_dcKbgg&usqp=CAU";

function contains<T extends string>(list: ReadonlyArray<T>, value: string): value is T {
    return list.some((item) => item === value);
}

const main = async () => {
    const isExist = await exist(FILE_PATH);
    if (!isExist) {
        throw new Error("No File");
    }

    const json = readXlsx(FILE_PATH) as ExelType[];

    const errors: unknown[] = [];
    const datas: DataType[] = [];

    json.forEach((e, i) => {
        const { success, errors: _errors } = TSON.validate<ExelType>(e);
        if (!success) {
            errors.push({ i, errors: TSON.stringify(_errors) });
        }
        const { name, lunchPrice, dinnerPrice, corkCharge, phoneNumber, dayOff, parking, address, snss, openedAt } = e;

        const guTMP = address && address.split(" ")[1];
        const gu = contains(GU_TYPE, guTMP!) ? guTMP : "";

        // console.log("gu :", gu);
        datas.push({
            name,
            ...(lunchPrice && { lunchPrice }),
            ...(dinnerPrice && { dinnerPrice }),
            corkCharge,
            phoneNumber,
            ...(gu && { gu }),
            dayOff,
            parking: !!parking,
            address,
            ...(snss && isURL(snss) && { snss }),
            // snss,
            openedAt: openedAt ? new Date(openedAt) : undefined,
            image: DEFAULT_IMAGE
        });
    });

    if (errors && errors.length > 0) {
        console.log("errors :", errors);
        throw new Error("Check Your Error");
    }

    // 유저 5명 생성하기
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
        const userInitialData = {
            // @Issue `unique`이기 때문에 수정하고 실행하시기 바랍니다.
            email: `test_${i}@gmail.com`
        };
        await prisma.user.create({ data: userInitialData });
    }

    // 엑셀에서 읽은 데이터, restaurant 생성하기
    for (const data of datas) {
        const { snss, ...rest } = data;
        // @Issue createMany에서는 relations에 접근해 같이 생성 불가능.
        // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records
        await prisma.restaurant.create({
            data: {
                ...rest,
                ...(snss && {
                    snss: {
                        create: [{ link: snss }]
                    }
                })
            }
        });
    }
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
