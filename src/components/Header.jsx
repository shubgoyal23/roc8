"use client";

import Link from "next/link";

function Header() {
   return (
      <div className="flex flex-col pb-4 w-full bg-white max-md:max-w-full">
         <div className="flex flex-col justify-center items-end px-16 pt-1 w-full text-xs bg-white text-zinc-800 max-md:px-5 max-md:max-w-full">
            <div className="flex gap-5 justify-end pl-3.5">
               <div className="justify-center py-0.5 whitespace-nowrap">
                  Help
               </div>
               <div className="justify-center py-0.5">Orders & Returns</div>
               <div className="justify-center p-0.5 text-right">Hi, John</div>
            </div>
         </div>

         <div className="flex gap-5 items-center justify-between self-center px-5 mt-2 w-full max-w-[1360px] max-md:flex-wrap max-md:max-w-full">
            <Link href={"/"}>
               <div className="text-3xl font-bold text-black">ECOMMERCE</div>
            </Link>
            <div className="flex gap-5 text-base font-semibold text-black max-md:flex-wrap pr-20">
               <div className="grow">Categories</div>
               <div>sales</div>
               <div>Clearance</div>
               <div>New stock</div>
               <div>Trending</div>
            </div>
            <div className="flex gap-5 justify-between">
               <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/60ae73f8a76ed0e41cd9f289463ef507bcd8f984a5f9ffd01e9da6d417283fee?apiKey=138a9a05636f4818b7903db304a97a25&"
                  className="shrink-0 w-8 aspect-square"
               />
               <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b5a1d1ea050cd8214a3c6b75f35155739321540846412f1523e93187ba89f96?apiKey=138a9a05636f4818b7903db304a97a25&"
                  className="shrink-0 w-8 aspect-square"
               />
            </div>
         </div>
      </div>
   );
}

export default Header;
