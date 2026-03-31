


import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import Landing from './pages/Landing';
import Compare from './pages/Compare';
import CompareMain from './pages/CompareMain';
import CardPage from './pages/CardPage';
import Analytics from './pages/Analytics';
import LeaderBoard from './pages/LeaderBoard';
function App() {
  

  return (
    <>
       <BrowserRouter>
       <Routes>
<Route path="/" element={<Landing/>}/>
<Route path="profile/:username" element={<Dashboard/>}/>
<Route path="/compare" element={<Compare/>}/>
<Route path='/compare/:user1/:user2' element={<CompareMain/>} />
<Route path='/card' element={<CardPage/>} />
<Route path='/analytics' element={<Analytics/>} />
<Route path='/leaderboard' element={<LeaderBoard/>} />
       </Routes>
       
       
       
       
       
       </BrowserRouter>








    </>
  )
}

export default App
