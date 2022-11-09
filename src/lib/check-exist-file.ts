import { promises as Fs } from "fs";

export const exist = async (filePath: string) => {
    try {
        await Fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
};

if (require.main === module) {
    (async () => {
        const filePath = "C:/Users/ehgks0083/Desktop/seed_2.xlsx";

        const rv = await exist(filePath);

        console.log("rv :", rv);

        process.exit(1);
    })();
}
