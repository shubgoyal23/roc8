import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
export async function GET(req) {
   try {
    let cookie = req.cookies.get("session");
      if (!cookie) {
         return NextResponse.json(
            { message: "unauthorised request" },
            { status: 403 }
         );
      }

      const token = Jwt.verify(cookie.value, process.env.REFRESH_TOKEN_SECRET);

      if (!token) {
         return NextResponse.json(
            { message: "cookie is expired" },
            { status: 401 }
         );
      }



      const client = await connectDb.connect();

      const getUsersCategory = await client.query("SELECT * FROM userscategory where userId = ($1)", [token.id]);
      const getCategory = await client.query("SELECT * FROM category");

      if (getCategory.rowCount === 0) {
         return NextResponse.json(
            { message: "no category found" },
            { status: 401 }
         );
      }

      return NextResponse.json(
         {
            message: "all catergory fetched successfully",
            data: getCategory.rows,
            userData: getUsersCategory.rows
         },
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

export async function POST(req) {
   try {
      let cookie = req.cookies.get("session");
      if (!cookie) {
         return NextResponse.json(
            { message: "unauthorised request" },
            { status: 403 }
         );
      }
      const token = Jwt.verify(cookie.value, process.env.REFRESH_TOKEN_SECRET);

      if (!token) {
         return NextResponse.json(
            { message: "cookie is expired" },
            { status: 401 }
         );
      }

      const userId = token.id;
      const { productId } = await req.json();

      if (!(userId && productId)) {
         return NextResponse.json(
            { message: "All feilds are required" },
            { status: 401 }
         );
      }
      const client = await connectDb.connect();
      const check = await client.query(
         "SELECT * FROM userscategory where userId = ($1) and categoryid = ($2)",
         [userId, productId]
      );

      if (check.rowCount === 0) {
         const queryText =
            "INSERT INTO userscategory (userId, categoryId) VALUES($1, $2)";
         const values = [userId, productId];
         await client.query(queryText, values);

         return NextResponse.json(
            { message: "category added to save list" },
            { status: 200 }
         );
      } else {
         const queryText = "DELETE FROM userscategory WHERE id = ($1)";
         const values = [check.rows[0]?.id];
         await client.query(queryText, values);

         return NextResponse.json(
            { message: "category removed from list" },
            { status: 200 }
         );
      }
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error.message }, { status: 400 });
   }
}
