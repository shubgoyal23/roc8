"use client";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

function Verify() {
   const router = useRouter();
   const [email, setemail] = useState("");
   const emptyArr = ["", "", "", "", "", "", "", ""];
   const refs = useRef();
   const [active, setactive] = useState(0);
   const [inputs, setInputs] = useState(emptyArr);
   const [missing, setMissing] = useState(emptyArr);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      refs.current?.focus();
   }, [active]);

   const handleSubmit = async () => {
      setError("")
      const missed = inputs
         .map((item, i) => {
            if (item === "") return i;
         })
         .filter((item) => item || item === 0);

      setMissing(missed);
      if (missed.length) {
         return;
      }
      setLoading(true)

      const code = inputs.join("");
      const response = await fetch("/api/verify", {
         method: "post",
         body: JSON.stringify({ code }),
      });
      const r = await response.json();

      if (response.status < 400) {
         router.replace("/dashboard");
      } else {
         setError(r.message);
      }
      setLoading(false)
   };
   const handleInputChange = (e, index) => {
      const val = e.target.value;
      if (!Number(val)) return;
      if (index < inputs.length - 1) {
         setactive((prev) => Number(prev) + 1);
      }
      const copyInputs = [...inputs];
      copyInputs[index] = val;
      setInputs(copyInputs);
   };

   const handleOnKeyDown = (e, index) => {
      if (e.keyCode === 8) {
         const copyInputs = [...inputs];
         copyInputs[index] = "";
         setInputs(copyInputs);

         if (index > 0) {
            setactive((prev) => Number(prev) - 1);
         }
      }
   };

   const handlePaste = (e) => {
      const data = e.clipboardData.getData("text");

      if (!Number(data)) return;

      const pastCode = data.split("");
      setactive(pastCode.length);

      if (pastCode.length !== inputs.length) {
         for (let index = pastCode.length; index < emptyArr.length; index++) {
            pastCode.push("");
         }
      }
      setInputs(pastCode);
   };

   return (
      <div className="flex flex-col self-center px-16 py-14 mt-10 max-w-full bg-white rounded-3xl border border-solid border-stone-300 w-[576px] max-md:px-5">
         <div className="self-center text-3xl font-semibold text-black">
            Verify your email
         </div>
         <div className="self-center mt-9 text-base text-center text-black">
            Enter the 8 digit code you have received on <br />
            <span className="font-medium">{email ? email : " your Email"}</span>
         </div>
         <div className="w-full flex justify-center items-center">
            {loading ? <Loading /> : ""}
         </div>
         <span className="text-center w-full text-red-500 mt-3"> {error} </span>

         <div className="flex gap-3 px-0.5 mt-3 max-md:flex-wrap">
            {emptyArr.map((item, i) => {
               return (
                  <input
                     value={inputs[i]}
                     key={uuid()}
                     ref={active === i ? refs : null}
                     type="text"
                     maxLength="1"
                     onPaste={handlePaste}
                     onChange={(e) => handleInputChange(e, i)}
                     onKeyDown={(e) => handleOnKeyDown(e, i)}
                     className={`shrink-0 bg-white rounded-md border-2 border-solid  focus:outline-lime-600 h-[47px] w-[47px] cursor-auto text-center ${
                        missing.includes(i)
                           ? "border-red-500"
                           : "border-stone-300"
                     }`}
                  />
               );
            })}
         </div>
         <div
            onClick={handleSubmit}
            className="justify-center items-center px-16 py-5 mt-16 text-base font-medium tracking-wider text-center text-white uppercase whitespace-nowrap bg-black rounded-md border border-black border-solid max-md:px-5 max-md:mt-10 max-md:max-w-full cursor-pointer"
         >
            Verify
         </div>
      </div>
   );
}

export default Verify;
