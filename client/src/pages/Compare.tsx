import React,{useState}from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/ui/navbar'

const Compare = () => {
  const navigate = useNavigate();
const [user1,setUser1]=useState("");
const [user2,setUser2]=useState("");


const handleCompare=()=>{
    if(!user1.trim() || !user2.trim()) return;
    
navigate(`/compare/${user1}/${user2}`)

};


  return (
  

    <div>
         <Navbar />
    <div className="max-w-md mx-auto mt-20 space-y-4 text-center p-4">
       
  
      <h1 className="text-2xl font-bold">Compare Developers</h1>


      <Input
        placeholder="Enter first github username"
        value={user1}
        onChange={(e) => setUser1(e.target.value)}
      />

      <Input
        placeholder="Enter second github username"
        value={user2}
        onChange={(e) => setUser2(e.target.value)}
      />

      <Button onClick={handleCompare} className="p-2text-lg font-bold bg-amber-300">
        Compare
      </Button>
    </div>
</div>
  )
}

export default Compare
