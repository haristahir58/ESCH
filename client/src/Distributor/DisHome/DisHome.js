import React from 'react'
import Sidebar from '../../Distributor/Components/Sidebar/DisSidebar'

import Navbar from '../Components/navbar/Navbar'
import Chart from '../../Admin/Components/chart/Chart';
import Featured from '../../Admin/Components/featured/Featured'
import '../Components/Profile/Profile.css'

function DisHome() {
  return (
    <div className='home'>
        <Sidebar/>
        <div className="homeContainer">
          <Navbar/>

          </div>
          </div>
          
  )
}

export default DisHome
