import { connectDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
   try {
      const client = await connectDb.connect();

      const { email, password } = await req.json();

      if (!(email && password)) {
         return NextResponse.json(
            { message: "All feilds are required" },
            { status: 401 }
         );
      }

      const check = await client.query(
         "SELECT * FROM users WHERE email = ($1)",
         [email]
      );

      if (check.rowCount === 0) {
         return NextResponse.json(
            { message: "Email not registerd" },
            { status: 401 }
         );
      }

      const userData = check.rows[0];
      const pass = await bcrypt.compare(password, userData.password);

      if (!pass) {
         return NextResponse.json(
            { message: "Password incorrect" },
            { status: 401 }
         );
      }
      const token = jwt.sign(
         {
            email: userData.email,
            id: userData.id
         },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn:  process.env.REFRESH_TOKEN_EXPIRY}
      );
      cookies().set("session", token, { secure: true, httpOnly: true });

      return NextResponse.json(
         { message: "user Loggedin successfully" },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json(
         { message: "user creation failed" },
         { status: 400 }
      );
   }
}
