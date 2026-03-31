

// import React, { useEffect,useState } from 'react'
// import Navbar from '@/components/ui/navbar'
// import { useLeaderBoard } from '@/hooks/useLeaderboard'
// import {
//   Pagination,
//   PaginationContent,
  
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"

// import { Spinner } from '@/components/ui/spinner'
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



// const LeaderBoard = () => {
// const [page,setPage]=useState(1);

// const {data,loading,error}=useLeaderBoard(page);

// console.log(data);

// if (loading)
//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <Spinner className='text-3xl w-20px h-20px' />
//     </div>
//   );

// if (error)
//   return (
//     <div className="flex items-center justify-center min-h-screen text-red-500">
//       Error: {error}
//     </div>
//   );

// const No1=data?.top3?.slice(0,1);
// const No2=data?.top3?.slice(1,2);
// const No3=data?.top3?.slice(2,3);





//   return (
//     <div>
//       <Navbar></Navbar>

// {/* top 3 */}
// <section>

// <div>
//  <p>{2}</p>
//      <Avatar className="w-15 h-15">
//         <AvatarImage src={No2?.user?.avatar_url} />
//         <AvatarFallback>{No2?.user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
//       </Avatar>
  
   
//     <p>{No2?.user?.name||No2?.user?.username}</p>
// </div>
// <div>
//   <p>{2}</p>
//      <Avatar className="w-15 h-15">
//         <AvatarImage src={No2?.user?.avatar_url} />
//         <AvatarFallback>{No2?.user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
//       </Avatar>
  
   
//     <p>{No2?.user?.name||No2?.user?.username}</p>
// </div>
// <div>
//   <p>{2}</p>
//      <Avatar className="w-15 h-15">
//         <AvatarImage src={No2?.user?.avatar_url} />
//         <AvatarFallback>{No2?.user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
//       </Avatar>
  
   
//     <p>{No2?.user?.name||No2?.user?.username}</p>
// </div>






// </section>






// {/* main leadboard 10  */}
// <section>
// {data?.data?.map((u,idx) =>(

// <div key={idx} className='flex items-center justify-around mb-5 mx-auto gap-5 border-2 rounded-lg p-3 '>
//       <p>{u?.rank}</p>
//      <Avatar className="w-15 h-15">
//         <AvatarImage src={u?.avatar} />
//         <AvatarFallback>{u.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
//       </Avatar>
  
   
//     <p>{u?.name||u?.username}</p>
//     <p>{u?.score}</p>
//     <p>{u?.label}</p>
    

// </div>




// ))}

// </section>





















// <Pagination>
//   <PaginationContent>
//     <PaginationItem>
//       <PaginationPrevious onClick={()=>setPage(prev=>prev<2?prev:prev-1)} />
//     </PaginationItem>

//  <PaginationItem>
//       <PaginationLink>{page}</PaginationLink>
//     </PaginationItem>




//     <PaginationItem>
//       <PaginationNext onClick={()=>setPage(p=>p>=data?.totalPages ?p:p+1)} />
//     </PaginationItem>


//   </PaginationContent>
// </Pagination>






//     </div>
//   )
// }

// export default LeaderBoard
import React, { useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useLeaderBoard } from "@/hooks/useLeaderboard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  FaCrown,
  FaFire,
  FaRocket,
  FaLeaf,
  FaSeedling,
} from "react-icons/fa";

const badgeConfig = {
  Elite: { color: "text-yellow-400", icon: <FaCrown /> },
  Pro: { color: "text-purple-400", icon: <FaFire /> },
  "Rising Dev": { color: "text-blue-400", icon: <FaRocket /> },
  Intermediate: { color: "text-green-400", icon: <FaLeaf /> },
  Beginner: { color: "text-gray-400", icon: <FaSeedling /> },
};

const LeaderBoard = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useLeaderBoard(page);

  if (loading)
    return (

        <div>
             <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        
        <Spinner className="w-10 h-10" />
      </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  const top3 = data?.top3 || [];

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* 🔥 TOP 3 PODIUM */}
      <section className="flex justify-center items-end gap-6 mt-10 flex-wrap">
        {top3.map((user, idx) => {
          const rank = idx + 1;
          const badge = badgeConfig[user.stats.devScore.label];

          return (
            <div
              key={user.id}
              className={`flex flex-col items-center ${
                rank === 1 ? "order-2 scale-110 mb-5" : ""
              } ${rank === 2 ? "order-1" : ""} ${
                rank === 3 ? "order-3" : ""
              }`}
            >
              <p className="text-xl font-bold mb-2">#{rank}</p>

              <Avatar className="w-20 h-20 border-2 border-white">
                <AvatarImage src={user.user.avatarUrl} />
                <AvatarFallback>
                  {user.user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="mt-2 font-semibold">
                {user.user.name || user.user.username}
              </p>

              <div
                className={`flex items-center gap-1 text-sm ${badge.color}`}
              >
                {badge.icon}
                {user.stats.devScore.label}
              </div>

              <p className="text-lg font-bold">{user.devScore}</p>
            </div>
          );
        })}
      </section>

      {/* 🧾 MAIN LIST */}
      <section className="max-w-3xl mx-auto mt-10 px-4">
        {data?.data?.map((u) => {
          const badge = badgeConfig[u.label];

          return (


            <a href={`/profile/${u?.username}`}>
            <div
              key={u.rank}
              className="flex items-center justify-between bg-gray-900 rounded-xl p-4 mb-4 hover:bg-gray-800 transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold w-6">#{u.rank}</p>

                <Avatar className="w-12 h-12">
                  <AvatarImage src={u.avatar} />
                  <AvatarFallback>
                    {u.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <p className="font-medium">
                  {u.name || u.username}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6">
                <div className={`flex items-center gap-1 ${badge.color}`}>
                  {badge.icon}
                  <span className="hidden sm:inline">{u.label}</span>
                </div>

                <p className="font-bold text-lg">{u.score}</p>
              </div>
            </div>
            </a>
          );
        })}
      </section>

      {/* 📄 PAGINATION */}
      <div className="flex justify-center mt-8 pb-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setPage((p) => (p > 1 ? p - 1 : p))
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink>{page}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((p) =>
                    p < data?.totalPages ? p + 1 : p
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default LeaderBoard;