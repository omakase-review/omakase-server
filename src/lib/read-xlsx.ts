import path from "path";
import * as xlsx from "xlsx";

export const readXlsx = (filePath: string) => {
    const excelFile = xlsx.readFile(filePath.split(path.sep).join("/"));
    const sheetName = excelFile.SheetNames[0]; // @details 첫번째 시트 정보 추출

    const firstSheet = excelFile.Sheets[sheetName]; // @details 시트의 제목 추출

    // @details 엑셀 파일의 첫번째 시트를 읽어온다.

    const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });

    // console.log(jsonData);

    return jsonData;
};

if (require.main === module) {
    const filePath = "C:/Users/ehgks0083/Desktop/omakase-server/src/db/seed.xlsx";
    readXlsx(filePath);
}
