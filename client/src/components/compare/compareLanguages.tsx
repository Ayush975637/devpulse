import React from 'react'
import { Progress } from "@/components/ui/progress";

const CompareLanguages = ({user1,user2}) => {


     const total1 = user1?.stats?user1.stats.topLanguages.reduce((sum, l) => sum + l.count, 0) : 0;
     const total2 = user2?.stats?user2.stats.topLanguages.reduce((sum, l) => sum + l.count, 0) : 0;


const winner = total1 > total2 ? 'user1' : total2 > total1 ? 'user2' : 'tie';









  return (
    <div className='border-2 rounded-lg m-4'>
      <p className='text-md md:text-lg text-center mb-1 mt-4 font-bold text-orange-300 '>Compare Top Languages</p>
    
    <div className=' flex  grid-cols-1 md:grid-cols-2 gap-8 mt-4  m-4 p-5 '>
   
      {/* left */}
      <section className='w-1/2'>
      <p className='text-md md:text-xl font-bold text-blue-500 '>{user1?.profile?.name}</p>
 {user1?.stats?.topLanguages.map((lang, index) => {
        const percent = (lang.count / total1) * 100;

        return (
          <div key={index}>
            <div className="flex justify-between mb-1 text-sm">
              <span>{lang.lang}</span>
              <span>{lang.count} repos</span>
            </div>

            <Progress value={percent} indicatorClassName={`h-2 ${ winner === 'user1' ? 'bg-yellow-400' : 'bg-red-500'}`}     />

            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(percent)}%
            </div>
          </div>
        );
      })}
      </section>


{/* right */}
<section className='w-1/2'>
<p className='text-md md:text-xl font-bold text-pink-500'>{user2?.profile?.name}</p>
 {user2?.stats?.topLanguages.map((lang, index) => {
        const percent = (lang.count / total2) * 100;

        return (
          <div key={index}>
            <div className="flex justify-between mb-1 text-sm">
              <span>{lang.lang}</span>
              <span>{lang.count} repos</span>
            </div>

            <Progress value={percent} indicatorClassName={`h-2 ${ winner === 'user2' ? 'bg-yellow-400' : 'bg-red-500'}`}/>

            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(percent)}%
            </div>
          </div>
        );
      })}
</section>
    </div>
    </div>
  )
}

export default CompareLanguages
