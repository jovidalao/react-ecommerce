import { cookies as GetCookies } from "next/headers";

interface Props {
    prefix: string;
    value: string;
}

// generate a cookie for authentication
export const generateAuthCookie = async ({
    prefix,
    value,
}: Props) => {
    const cookies = await GetCookies();
    cookies.set({
        name: `${prefix}-token`, // "payload-token" by default
        value: value,
        httpOnly: true,
        path: "/",
    });
}