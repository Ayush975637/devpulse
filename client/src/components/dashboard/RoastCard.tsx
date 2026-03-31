import React from 'react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Spinner } from "@/components/ui/spinner"
const RoastCard = ({username}) => {
    const [roast, setRoast] = useState('');
    const [loading , setLoading] = useState(false);
    const handleButtonClick = async () => {
        setLoading(prev=>!prev);

        if(!username) return;
        if(!loading) return;
        try{
        const res = await fetch(`/api/github/roast/${username}`);
        const json = await res.json();
        setRoast(json.roast);
        }
        catch(e){
            setRoast('Failed to generate roast');
        }
        finally{
            setLoading(prev=>!prev);
        }


    }
  return (
    <div>
      
       
        <Button variant="outline" className='mt-4' onClick={() => {
          handleButtonClick();
        }}>
          {loading ? 
          
          <span className='flex items-center gap-2'><Spinner /> Generating roast...</span>
           : '🔥 Roast this github profile'}
        </Button>
        {roast && <p className='mt-4'>{roast}</p>}
    </div>
  )
}
         
     

export default RoastCard
