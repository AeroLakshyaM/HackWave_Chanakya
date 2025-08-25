import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Analytics from './Analytics'
import Userprofile from './Userprofile'
import SettingsPage from './SettingsPage'
import MeetingRoom from './meeting'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [activePage, setActivePage] = useState('Analytics Page')
  const navigate = useNavigate()

  const renderPage = (page) => {
    switch (page) {
      case 'Analytics Page':
        return <Analytics />
      case 'Meeting Room':
        return <MeetingRoom />
      case 'Profile':
        return <Userprofile />
      case 'Settings':
        return <SettingsPage />
      default:
        return <Analytics />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          navigate={navigate}
        />
      </div>
      
      {/* Right Content Area */}
      <div className="flex-1 overflow-auto">
        {renderPage(activePage)}
      </div>
    </div>
  )
}

export default Dashboard
