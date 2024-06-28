import { withLocales } from "nextra/locales";
import { NextResponse } from "next/server";

export const middleware = withLocales((request) => {
    const basicAuth = request.headers.get("authorization");
    const url = request.nextUrl;
    const contentRoute = /\/(jpe?g|svg|png|webmanifest|xml|ico|txt)$/.test(request.nextUrl.pathname);

    if (contentRoute) return NextResponse.next();

    if (basicAuth) {
        const authValue = basicAuth.split(" ")[1];
        const [user, pwd] = atob(authValue).split(":");

        if (user === "LAX" && pwd === "norwalk") {
            return NextResponse.next();
        } else {
            request.headers.delete("authorization");
            url.pathname = "/404"; // Redirect to 404 page for incorrect credentials
            return NextResponse.rewrite(url);
        }
    }

    url.pathname = "/404"; // Redirect to 404 page if the auth is cancelled or missing
    return NextResponse.rewrite(url);
});
