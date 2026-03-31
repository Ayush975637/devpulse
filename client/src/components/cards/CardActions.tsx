import React from 'react'
import html2canvas from 'html2canvas'
import { Button } from '../ui/button'
import { useState } from 'react'
const CardActions = ({username, cardRef}) => {
    if(!username||!cardRef) return null;

const [downloading,setDownloading]=useState(false);
console.log("CardActions rendered with username:", username);
console.log("CardActions received cardRef:", cardRef);
const handleDownload=async ()=>{
setDownloading(true);

await document.fonts.ready;

const canvas=await html2canvas(cardRef.current,{
    backgroundColor:null,
    scale:2,
    useCORS:true,
})

const link=document.createElement("a");
link.download=`${username}_card.png`;
link.href=canvas.toDataURL();
link.click();

setDownloading(false);

}




  return (
    <div>
      
        <Button onClick={()=>{
            handleDownload()
        }} variant="outline" className='w-full mt-4 cursor-pointer w-20px items-center justify-center'>

           
            {downloading ? "Downloading..." : "Download Card"}
        </Button>





    </div>
  )
}

export default CardActions
