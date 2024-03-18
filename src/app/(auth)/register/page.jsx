"use client";
import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

function MyComponent() {
   const [loading, setLoading] = React.useState(false);

   const router = useRouter();
   async function putData(e) {
      e.preventDefault();
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3000/api/register", {
         method: "post",
         body: JSON.stringify(data),
      });
      const r = await res.json();
      setError(r.message);

      if (res.status < 400) {
        fetch("http://localhost:3000/api/verify");
         router.replace("/verify");
         setLoading(false);

         setDate({
            name: "",
            email: "",
            password: "",
         });
      }

   }

   const [error, setError] = React.useState(null);
   const [data, setDate] = React.useState({
      name: "",
      email: "",
      password: "",
   });
   return (
      <form
         action=""
         onSubmit={putData}
         className="flex flex-col self-center px-16 py-12 mt-10 max-w-full text-base bg-white rounded-3xl border border-solid border-stone-300 w-[576px] max-md:px-5"
      >
         <div className="self-center text-3xl font-semibold text-black">
            Create Account
         </div>

         <span className="text-center w-full text-red-500 mt-3"> {error} </span>
         <div className="w-full flex justify-center items-center">
            {loading ? <Loading /> : ""}
         </div>

         <div className="mt-9 text-black max-md:max-w-full">Name</div>
         <input
            value={data.name}
            onChange={(e) =>
               setDate((prev) => {
                  return { ...prev, name: e.target.value };
               })
            }
            name="name"
            className="flex gap-5 px-4 py-4 mt-3 whitespace-nowrap bg-white rounded-md border border-solid border-stone-300 max-md:flex-wrap max-md:max-w-full"
         ></input>

         <div className="mt-9 text-black max-md:max-w-full">Email</div>
         <input
            value={data.email}
            onChange={(e) =>
               setDate((prev) => {
                  return { ...prev, email: e.target.value };
               })
            }
            name="email"
            className="flex gap-5 px-4 py-4 mt-3 whitespace-nowrap bg-white rounded-md border border-solid border-stone-300 max-md:flex-wrap max-md:max-w-full"
         ></input>

         <div className="mt-9 text-black max-md:max-w-full">Password</div>
         <input
         type="password"
            value={data.password}
            onChange={(e) =>
               setDate((prev) => {
                  return { ...prev, password: e.target.value };
               })
            }
            name="password"
            className="flex gap-5 px-4 py-4 mt-3 whitespace-nowrap bg-white rounded-md border border-solid border-stone-300 max-md:flex-wrap max-md:max-w-full"
         ></input>

         <button className="justify-center items-center px-16 py-5 mt-10 font-medium tracking-wider text-center text-white uppercase whitespace-nowrap bg-black rounded-md border border-black border-solid max-md:px-5 max-md:max-w-full">
            Create
         </button>
         <div className="shrink-0 mt-7 h-px bg-stone-300 max-md:max-w-full" />
         <div className="flex gap-3.5 self-center mt-9">
            <div className="grow text-zinc-800">Already have an Account? </div>
            <div className="font-medium tracking-wider text-black uppercase">
               <Link href={"/login"}>sign in</Link>
            </div>
         </div>
      </form>
   );
}

export default MyComponent;
