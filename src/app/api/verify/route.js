import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
import { connectDb } from "@/lib/db";
import { transporter } from "@/lib/email";
import { cookies } from "next/headers";

export async function GET(request) {
   try {
      let cookie = request.cookies.get("verify");
      if (!cookie) {
         return NextResponse.json(
            { message: "cookie is required" },
            { status: 401 }
         );
      }
      const check = Jwt.verify(
         cookie.value,
         process.env.EMAIL_VERIFICION_SECRET
      );

      if (!check) {
         return NextResponse.json(
            { message: "cookie is expired" },
            { status: 401 }
         );
      }

      const client = await connectDb.connect();
      const finduser = await client.query(
         "SELECT * FROM users WHERE email = ($1)",
         [check.email]
      );
      if (!finduser.rowCount) {
         return NextResponse.json(
            { message: "token is invalid" },
            { status: 401 }
         );
      }

      let otp = "";
      let x = 0;
      while (x < 8) {
         otp += `${Math.floor(Math.random() * 10)}`;
         x++;
      }
      const hast = Jwt.sign({ otp }, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: 60 * 15,
      });

      const putCode = await client.query(
         "UPDATE users SET emailcode = ($1) WHERE email = ($2);",
         [hast, check.email]
      );

      const mail = await transporter.sendMail({
         from: '"Proteinslice.com" <verify@proteinslice.com>',
         to: finduser.rows[0]?.email,
         subject: "Verify Your Email",
         text: "Email verification mail from ProteinSlice",
         html: `<h1>${otp}</h1>`,
      });

      return NextResponse.json(
         { message: "verifcation email is send" },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
   }
}

export async function POST(request) {
   try {
      const client = await connectDb.connect();

      const { code } = await request.json();

      if (!code) {
         return NextResponse.json(
            { message: "All feilds are required" },
            { status: 401 }
         );
      }

      let cookie = request.cookies.get("verify");
      if (!cookie) {
         return NextResponse.json(
            { message: "cookie is required" },
            { status: 401 }
         );
      }
      const token = Jwt.verify(
         cookie.value,
         process.env.EMAIL_VERIFICION_SECRET
      );

      if (!token) {
         return NextResponse.json(
            { message: "cookie is expired" },
            { status: 401 }
         );
      }

      const email = token.email;
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

      const pass = Jwt.verify(
         userData.emailcode,
         process.env.REFRESH_TOKEN_SECRET
      );

      if (!pass) {
         return NextResponse.json(
            { message: "token expired" },
            { status: 401 }
         );
      }

      if (pass.otp !== code) {
         return NextResponse.json(
            { message: "code invalid" },
            { status: 401 }
         );
      }

      const verifiy = await client.query(
         "UPDATE users SET emailverify = ($1) WHERE email = ($2);",
         [true, userData.email]
      );

      const token2 = Jwt.sign(
         {
            email: userData.email,
            id: userData.id
         },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn:  process.env.REFRESH_TOKEN_EXPIRY}
      );
      cookies().set("session", token2, { secure: true, httpOnly: true });

      return NextResponse.json({ message: "user Verified" }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json(
         { message: "user creation failed" },
         { status: 400 }
      );
   }
}
