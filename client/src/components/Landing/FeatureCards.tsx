import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
const features = [
  {
    title: "DevScore",
    desc: "Algorithmic score based on impact, consistency and reach",
    endpoint:"/card"
  },
  {
    title: "LeaderBoard",
    desc: "Check your github rank among all codevex users ",
    endpoint:"/leaderboard"
  },
  {
    title: "Compare",
    desc: "See how you stack up against any developer",
    endpoint:"/compare"
  },
  {
    title: "Analytics",
    desc: "Algorithmic analysis of your development patterns",
    endpoint:"/analytics"

  },
];

const FeatureCards = () => {
    const navigate = useNavigate();

  return (
    <section className="px-4 py-16">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        
        
        {features.map((item, i) => (
            
            <a key={i} href={item.endpoint} onClick={(e)=>{
                e.preventDefault();
                navigate(item.endpoint.replace(":username","octocat"))
            }} className="group  transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
             
          <Card
            key={i}
            className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            
     
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-purple-500/10 to-amber-500/10 blur-xl"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition">
                {item.title}
              </CardTitle>

              <CardDescription className="mt-2 text-sm text-muted-foreground">
                {item.desc}
              </CardDescription>
            </CardHeader>
          </Card>
   </a>
          
        ))}

      </div>

    </section>
  );
};

export default FeatureCards;