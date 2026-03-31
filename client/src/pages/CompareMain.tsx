
import React from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
// import { useCompare } from '../hooks/useCompare';
import WinnerBanner from '@/components/compare/WinnerBanner';
import { useGithub } from '@/hooks/useGithub';
import CompareHeader from '@/components/compare/CompareHeader';
import CompareScoreRow from '@/components/compare/CompareScoreRow';
import CompareLanguages from '@/components/compare/compareLanguages';
import Compare from './Compare';
import CompareRepos from '@/components/compare/compareRepos';
import CompareActivity from '@/components/compare/compareActivity';
import CompareGap from '@/components/compare/CompareGap';
import { Spinner } from '@/components/ui/spinner';
const CompareMain = () => {
const {user1,user2}=useParams();
console.log("params",user1,user2)
// const {data,isLoading,error}=useCompare({user1,user2})

const { data: data1, loading: loading1, error: error1 } = useGithub(user1);
const { data: data2, loading: loading2, error: error2 } = useGithub(user2);

// if (loading1 || loading2)
//   return (
//     <div>
//              <Navbar />
//       <div className="flex items-center justify-center min-h-screen">
        
//         <Spinner className="w-10 h-10" />
//       </div>
//       </div>
//   );
if (loading1 || loading2 || !data1 || !data2) return (
  <div>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="w-10 h-10" />
    </div>
  </div>
)

if (error1 || error2)
  return (
    <div className="flex items-center justify-center min-h-screen text-red-500">
      Error: {error1 || error2}
    </div>
  );
// if(isLoading) return <div>Loading...</div>

// if(error) return <div className='text-center mt-20 text-red-500'>Error: {error}</div>






  return (
    <div>
        <Navbar />

{/* WinnerBanner */}
<section>

<WinnerBanner user1={data1} user2={data2} />




</section>

{/* compareHeaders */}
<section>
   
<CompareHeader  user1={data1} user2={data2} />

</section>

{/* CompareScoreRow */}
<section>

<CompareScoreRow user1={data1} user2={data2} />
</section>

{/* compareLanguages */}
<section>

    <CompareLanguages user1={data1} user2={data2} />
</section>

{/* compareRepos */}
<section>

    <CompareRepos user1={data1} user2={data2} />
</section>

{/* compare Activity */}
<section>

    <CompareActivity weeklyCommits1={data1?.stats?.weeklyCommits} weeklyCommits2={data2?.stats?.weeklyCommits}  name1={data1?.profile?.name||data1?.profile?.username} name2={data2?.profile?.name||data2?.profile?.username} />
</section>


{/* Gape Analysis */}
<section>

<CompareGap user1={data1} user2={data2} />

</section>


     
    </div>
  )
}

export default CompareMain
