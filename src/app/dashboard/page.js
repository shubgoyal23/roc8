"use client";
import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
function Dashboard() {
   const [category, setCategory] = useState([]);
   const [usercatogry, setUsercatogry] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [display, setDisplay] = useState([]);
   const [pages, setPages] = useState([]);
   const [loading, setLoading] = useState(true);
   const perpage = 13;

   useEffect(() => {
      fetch("/api/category")
         .then((res) => res.json())
         .then((data) => {
            const arr = data.data.map((item) => {
               return data.userData.find((i) => i.categoryid === item.id)
                  ? { ...item, checked: true }
                  : { ...item, checked: false };
            });

            setCategory(arr);
            setUsercatogry(data.userData);
            setDisplay(arr.slice(0, 10));
            setPages([...Array(Math.ceil(arr.length / perpage) + 1).keys()].slice(1));
         })
         .catch((error) => console.log(error))
         .finally(() => { setLoading(false)});
   }, []);

   const changeInput = (id) => {
      fetch("/api/category", {
         method: "post",
         body: JSON.stringify({ productId: id }),
      })
         .then((res) => res.json())
         .then((data) => {
            setUsercatogry((prev) =>
               prev.filter((item) => item.categoryid !== id)
            );
         })
         .catch((error) => console.log(error));
   };

   const removeCheck = (id) => {
    console.log("object")
      setCategory((prev) =>
         prev.map((item) =>
            item.id !== id ? item : { ...item, checked: !item.checked }
         )
      );
      setDisplay((prev) =>
         prev.map((item) =>
            item.id !== id ? item : { ...item, checked: !item.checked }
         )
      );
   };

   const changePage = (i) => {
      if (i > pages.length) return;
      if (i < 1) return;
      const pageEnd = perpage * i; //10
      const pageStart = perpage * (i - 1); //10 - 0
      const arr = [];
      for (let index = pageStart; index < pageEnd; index++) {
         if (category[index]) {
            arr.push(category[index]);
         }
      }
      setDisplay(arr);
      setCurrentPage(i);
   };

   return (
      <div className="flex flex-col pb-7 bg-white rounded">
         <div className="flex flex-col items-start self-center px-16 pt-12 pb-20 mt-20 ml-20 max-w-full text-base leading-7 text-black bg-white rounded-3xl border border-solid border-stone-300 w-[576px] max-md:px-5 max-md:mt-10">
            <div className="ml-5 text-3xl font-semibold text-center text-black max-md:ml-2.5">
               Please mark your interests!
            </div>
            <div className="self-center mt-8">We will keep you notified.</div>
            <div className="self-stretch mt-12 mb-4 pl-10 text-xl font-medium leading-7 max-md:mt-10 max-md:max-w-full">
               My saved interests!
            </div>
            <div className="w-full flex justify-center items-center">{loading? <Loading />: ""}</div>
            <div className="pl-10">
               {display.map((item) => (
                  <label
                     key={uuid()}
                     className="flex gap-2 items-center cursor-pointer text-2xl font-semibold capitalize"
                  >
                     <input
                        checked={item.checked}
                        type="checkbox"
                        className="size-6 cursor-pointer accent-black"
                        onChange={() => {
                           changeInput(item.id);
                           removeCheck(item.id);
                        }}
                     ></input>
                     {item.name}
                  </label>
               ))}
            </div>
            <div className="self-stretch mt-10 ml-10 text-xl font-medium leading-7 text-black max-md:mt-10 max-md:max-w-full">
               <span
                  className={`mx-1 cursor-pointer`}
                  onClick={() => changePage(1)}
               >
                  &lt;&lt;
               </span>
               <span
                  className={`mx-1 cursor-pointer`}
                  onClick={() => changePage(currentPage - 1)}
               >
                  &lt;
               </span>

               {pages.map((item) => (
                  <span
                     key={uuid()}
                     className={`${
                        item === currentPage
                           ? "font-semibold text-black"
                           : "font-normal text-gray-700"
                     } mr-1 cursor-pointer`}
                     onClick={() => changePage(item)}
                  >
                     {item}
                  </span>
               ))}

               <span
                  className={`mx-1 cursor-pointer`}
                  onClick={() => changePage(currentPage + 1)}
               >
                  &gt;
               </span>
               <span
                  className={`mx-1 cursor-pointer`}
                  onClick={() => changePage(pages.length)}
               >
                  &gt;&gt;
               </span>
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
