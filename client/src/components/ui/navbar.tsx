import React from 'react'

import { Button } from "@/components/ui/button";
import { FaCodeBranch } from "react-icons/fa";
import { useTheme } from "next-themes";
import { FaRegMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
const Navbar = () => {
    const { theme,setTheme } = useTheme();
  return (
    <div>
        <nav className='flex items-center justify-between p-4'>

<Button variant="ghost" className='text-xl font-bold flex items-center cursor-pointer hover:bg-yellow-500 hover:text-white transition-colors duration-300'>
    <a className='flex flex-row items-center '>
    <FaCodeBranch size={20} className='mr-2' />
    CodeVex
    </a>
</Button>


      <Button onClick={()=>setTheme(theme==="light"?"dark":"light")}  className= {`cursor-pointer ${theme === "light" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}>

{theme === "light" ? <FaRegMoon size={20} /> : <IoMdSunny size={20} />}
      </Button>
</nav>
    </div>
  )
}

export default Navbar
