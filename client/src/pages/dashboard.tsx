import React, { use } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useGithub } from '../hooks/useGithub';
import { useParams,useNavigate } from 'react-router-dom';
import Profilecard from '@/components/dashboard/Profilecard';
import RepoList from '@/components/dashboard/RepoList';
import StatsRow from '@/components/dashboard/StatsRow';
import { Button } from '@/components/ui/button';
import ActivityChart from '@/components/dashboard/ActivityChart';
import DevScore from '@/components/dashboard/DevScore';
import Language from '@/components/dashboard/Language';
import RoastCard from '@/components/dashboard/RoastCard';
import { FaArrowLeft } from "react-icons/fa";
import { Spinner } from '@/components/ui/spinner';
import DevScoreSkeleton from '@/components/skeletons/DevScoreSkeleton';
import LanguageSkeleton from '@/components/skeletons/LanguagaeSkeleton';
import StatsSkeleton from '@/components/skeletons/StatsSkeleton';
import RepoSkeleton from '@/components/skeletons/RepoSkeleton';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';
import Heatmap from '@/components/dashboard/HeatMap';




const Dashboard = () => {

const { username } = useParams();
const navigate = useNavigate();

const {data,loading,error}=useGithub(username);



 

if(error) return <div className='text-center mt-20 text-red-500'>Error: {error}</div>


// if(!data) return <div className='text-center mt-20 text-gray-500'>No data found for user: {username}</div>



  return (

<div className="min-h-screen bg-background">
  <Navbar />

  {/* Header */}
  <div className="flex items-center gap-4 px-4 py-4 max-w-7xl mx-auto">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft />
    </Button>

    <h1 className="text-xl font-semibold">@{username}</h1>
  </div>

  {/* Main Container */}
  <div className="max-w-7xl mx-auto px-4 space-y-6">

    {/* Top Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Profile */}
    
      <section className="bg-card rounded-xl p-6 shadow-sm">
  <h2 className="font-semibold mb-4">Profile</h2>

  {loading ? (
    <ProfileSkeleton />
  ) : (
    <Profilecard profile={data?.profile} />
  )}
</section>

      {/* DevScore */}

  <section className="bg-card rounded-xl p-6 shadow-sm">
  <h2 className="font-semibold mb-4">DevScore</h2>

  {loading ? (
    <DevScoreSkeleton/>
  ) : (
     <DevScore devScore={data?.stats?.devScore} />
  )}
</section>


</div>




    {/* Stats Row */}


    <section className="bg-card rounded-xl p-6 shadow-sm">
  <h2 className="font-semibold mb-4">Stats</h2>

  {loading ? (
   <DevScoreSkeleton/>
  ) : (
     <StatsRow stats={data?.stats} />
  )}
</section>

    {/* Middle Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Languages */}
     


      <section className="bg-card rounded-xl p-6 shadow-sm">
  <h2 className="font-semibold mb-4">Languages</h2>

  {loading ? (
     <DevScoreSkeleton/>
  ) : (
         <Language language={data?.stats?.topLanguages} />
  )}
</section>

      {/* Activity */}



      <section className="bg-card rounded-xl p-1  shadow-sm">
  <h2 className="font-semibold mb-4">Activity</h2>

  {loading ? (
     <DevScoreSkeleton/>
  ) : (
    <div className='flex items-baseline'>
        <ActivityChart weeklyCommits={data?.stats?.weeklyCommits}  />
        </div>
  )}
</section>
<section className="bg-card rounded-xl p-6 shadow-sm hidden md:block">
  <h2 className="font-semibold mb-4">HeatMap</h2>

  {loading ? (
    <DevScoreSkeleton/>
  ) : (
        <Heatmap datax={data?.stats?.heatmapData} />
  )}
</section>
    </div>



    {/* Repos */}



     <section className="bg-card rounded-xl p-6 shadow-sm">
  <h2 className="font-semibold mb-4"> Top Repositories</h2>

  {loading ? (
    <DevScoreSkeleton/>
  ) : (
        <RepoList repos={data?.repos} />
  )}
</section>

    {/* Roast */}

<div className='hidden'>
   <section className={`bg-card rounded-xl p-6 shadow-sm  ${loading ? 'animate-pulse bg-gray-500 ' : ''} `} >
      <h2 className="font-semibold mb-4">AI Insight</h2>
      {/* <RoastCard /> */}
      <RoastCard username={username} />
    </section> 
</div>
  </div>
</div>


  )
}

export default Dashboard




