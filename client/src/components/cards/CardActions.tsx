import React from 'react'
// import html2canvas from 'html2canvas'
import {toPng}  from 'html-to-image';
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

const dataUrl=await toPng(cardRef.current,{
    backgroundColor:'transparent',
 pixelRatio:3,
 cacheBust:true
    
})

const link=document.createElement("a");
link.download=`${username}_card.png`;
link.href=dataUrl;
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
