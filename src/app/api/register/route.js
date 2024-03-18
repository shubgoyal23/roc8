import { connectDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function POST(req) {
   try {
      const client = await connectDb.connect();

      const { name, email, password } = await req.json();

      if (!(email && password && name)) {
         return NextResponse.json(
            { message: "All feilds are required" },
            { status: 401 }
         );
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordPattern =
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

      if (!emailPattern.test(email)) {
         return NextResponse.json(
            { message: "Invalid email address" },
            { status: 401 }
         );
      }

      if (!passwordPattern.test(password)) {
         return NextResponse.json(
            {
               message:
                  "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
            },
            { status: 401 }
         );
      }

      const check = await client.query(
         "SELECT * FROM users WHERE email = ($1)",
         [email]
      );

      if (check.rowCount) {
         return NextResponse.json(
            { message: "Email is already registered" },
            { status: 401 }
         );
      }

      const pass = await bcrypt.hash(password, 10);

      const queryText =
         "INSERT INTO users(name, email, password) VALUES($1, $2, $3)";
      const values = [name, email, pass];
      const response = await client.query(queryText, values);

      const token = jwt.sign(
         {
            email: email,
         },
         process.env.EMAIL_VERIFICION_SECRET,
         { expiresIn: 60 * 15 }
      );
      cookies().set("verify", token, { secure: true, httpOnly: true });

      return NextResponse.json(
         { message: "user Created successfully" },
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
