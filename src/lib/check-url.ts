import { URL } from "url";

export const isURL = (urlStr: string) => {
    try {
        // eslint-disable-next-line no-new
        new URL(urlStr);
        return true;
    } catch (error) {
        return false;
    }
};
