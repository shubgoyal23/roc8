import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
   try {
      let cookie = request.cookies.get("session");

      if (!cookie) {
         return NextResponse.json(
            { message: "already logged out" },
            { status: 401 }
         );
      }
      const check = Jwt.verify(cookie.value, process.env.REFRESH_TOKEN_SECRET);

      cookies().delete("session");

      return NextResponse.json(
         { message: "user logged out successfully" },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
   }
}
