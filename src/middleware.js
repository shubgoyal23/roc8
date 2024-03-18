'use server'
import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
import * as jose from 'jose'

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.EMAIL_VERIFICION_SECRET),
    secret2: new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
  }
export async function middleware(request) {

   if (request.nextUrl.pathname.startsWith("/verify")) {
       try {
           let cookie = request.cookies.get("verify");
           
           if (!cookie) {
               return NextResponse.redirect(new URL("/login", request.url));
            }
            const check = await jose.jwtVerify(cookie.value, jwtConfig.secret);

            if (!check) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
            
         const url = new URL("/verify", request.url);
         url.searchParams.set("email", check.payload?.email);
         return NextResponse.rewrite(url);

      } catch (error) {
        console.log(error)
         return NextResponse.redirect(new URL("/login", request.url));
      }
   }

   if (request.nextUrl.pathname.startsWith("/dashboard")) {
       try {
           let cookie = request.cookies.get("session");
           
           if (!cookie) {
               return NextResponse.redirect(new URL("/login", request.url));
            }
            const check = await jose.jwtVerify(cookie.value, jwtConfig.secret2);

            if (!check) {
                return NextResponse.redirect(new URL("/login", request.url));
            }      

      } catch (error) {
        console.log(error)
         return NextResponse.redirect(new URL("/login", request.url));
      }
   }
   if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
       try {
           let cookie = request.cookies.get("session");
           
            const check = await jose.jwtVerify(cookie.value, jwtConfig.secret2);

            if (check) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }      

      } catch (error) {
        console.log(error)
      }
   }
}
